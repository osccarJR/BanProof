import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";


const scopes = ["identify", "guilds"].join(" ");

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

        
        const response = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        const guilds = await response.json();

       
        const targetGuild = guilds.find(guild => guild.id === process.env.DISCORD_GUILD_ID);

        if (targetGuild) {
        
          isAuthorized = true;

          
          const memberResponse = await fetch(
            `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            }
          );

          const memberData = await memberResponse.json();

          console.log(memberData.roles);
        }

        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          isAuthorized: isAuthorized,
          
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
      return { ...token, ...user };
    },

    session: async ({ session, token }) => {
      // session.isAdult = token?.isAdult;
      return session;
    },
  },
};

export default NextAuth(authOptions);
