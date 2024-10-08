
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
        // Puedes añadir más lógica aquí si es necesario.
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

      // Asegúrate de que el rol "Dev" tenga acceso completo
      session.isAuthorized = session.isAuthorized || session.roles.includes("Dev");

      return session;
    },
  },
};

async function fetchRoles(accessToken) {
  try {
    const response = await fetch(
        `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
    );
    const data = await response.json();
    const userRoles = data.roles;
    if (!userRoles) {
      console.log("No se encontraron roles");
      return { roles: [], isAuthorized: false };
    }

    let roles = [];
    if (userRoles.includes('934220641727549490') || userRoles.includes('941000828511215636')) {
      roles.push("management");
    } else if (userRoles.includes('940339724118286399')) {
      roles.push("staff");
    }

    // Añadir rol "Dev" con autorización completa
    if (userRoles.includes('948657394156720198')) { // ID del rol "Dev"
      roles.push("Dev");
    }

    const rangos = {
      "Founder": "934105741420273765",
      "Owner": "1045127188128747560",
      "Dev": "948657394156720198",
      "Manager": "1144741012145717339",
      "Admin": "1147977563105394799",
      "JrAdmin": "1214074487469899817",
      "SrMod": "1147977564837642376",
      "Moderator+": "1213962495333761105",
      "Moderator": "1147977568193085581",
      "Helper": "1147977652993540237",
    };

    for (const rango in rangos) {
      if (userRoles.includes(rangos[rango])) {
        roles.push(rango);
        break;
      }
    }

    // Autorización para management, staff o Dev
    return { roles, isAuthorized: roles.includes("management") || roles.includes("staff") || roles.includes("Dev") };
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    return { roles: [], isAuthorized: false };
  }
}

export default NextAuth(authOptions);