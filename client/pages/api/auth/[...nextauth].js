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
        let isAuthorized = false;
        let role = "member";

        const response = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        const guilds = await response.json();
        const targetGuild = guilds.find(guild => guild.id === process.env.DISCORD_GUILD_ID);

        if (targetGuild) {
          const memberResponse = await fetch(
              `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
              {
                headers: {
                  Authorization: `Bearer ${tokens.access_token}`,
                },
              }
          );

          const memberData = await memberResponse.json();
          const allowedRoles = ['934220641727549490', '941000828511215636', '940339724118286399'];
          const hasAllowedRole = memberData.roles.some(role => allowedRoles.includes(role));
          isAuthorized = hasAllowedRole;

          if(memberData.roles.includes('934220641727549490') || memberData.roles.includes('941000828511215636')){
            role = "admin";
          } else if(memberData.roles.includes('940339724118286399')){
            role = "staff";
          }
        }

        return {
          id: profile.id,
          name: profile.username,
          email: profile.email, // Asegúrate de que el correo electrónico se extrae correctamente
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          isAuthorized: isAuthorized,
          role: role,
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
        token.role = user.role;
      }

      return token;
    },

    session: async ({ session, token }) => {
      session.id = token.id;
      session.name = token.name;
      session.email = token.email; // Asegúrate de que el correo electrónico esté en la sesión
      session.image = token.image;
      session.isAuthorized = token.isAuthorized;
      session.role = token.role;

      return session;
    },
  },
};

export default NextAuth(authOptions);
