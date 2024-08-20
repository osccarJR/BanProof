import connectToDatabase from "@/lib/mongoose";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
const scopes = ["identify", "email", "guilds"].join(" "); // Incluye 'email' en los alcances

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: { scope: scopes.concat(" guilds.members.read") },
      },

      profile: async (profile, tokens) => {
        const { roles, isAuthorized } = await fetchRoles(tokens.access_token);

        return {
          id: profile.id,
          name: profile.username,
          email: profile.email, // Asegúrate de que el correo electrónico se extrae correctamente
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          isAuthorized: isAuthorized,
          roles: roles || ["member"],
          access_token: tokens.access_token,
        };
      },
    }),
  ],

  callbacks: {
    signIn: async ({ user, account, profile }) => {
      if (account.provider === "discord") {
        return user.isAuthorized;
      }
      return true;
    },

    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email; // Asegúrate de que el correo electrónico esté en el token
        token.image = user.image;
        token.isAuthorized = user.isAuthorized;
        token.roles = user.roles || ["member"];
        token.access_token = user.access_token;
        token.lastRoleFetch = Date.now(); 
      }

      return token;
    },

    session: async ({ session, token }) => {
      session.id = token.id;
      session.name = token.name;
      session.email = token.email; // Asegúrate de que el correo electrónico esté en la sesión
      session.image = token.image;
      session.isAuthorized = token.isAuthorized;
      session.roles = token.roles || ["member"];
      session.access_token = token.access_token;
      
      const THIRTY_MINUTES = 30 * 60 * 1000;
      if (Date.now() - token.lastRoleFetch > THIRTY_MINUTES) {
        const { roles, isAuthorized } = await fetchRoles(token.access_token);
        
        session.roles = roles;
        session.isAuthorized = isAuthorized;

        token.roles = roles; // Actualiza los roles en el token
        token.isAuthorized = isAuthorized;
        token.lastRoleFetch = Date.now(); // Actualiza la última vez que se obtuvieron los roles
      }


      return session;
    },
  },
};

async function fetchRoles(accessToken) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/updateRoles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ocurrio un fallo al obtener los roles');
    }

    const data = await response.json();
    const roles = data.roles || ["member"];
    const isAuthorized = roles.includes("management") || roles.includes("staff");
    return { roles, isAuthorized };
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    return { roles: ["member"], isAuthorized: false };
  }
}

export default NextAuth(authOptions);
