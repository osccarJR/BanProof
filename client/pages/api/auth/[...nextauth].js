import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";


export default NextAuth({
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            console.log("url: ", url)
            console.log("baseUrl: ",baseUrl)
        // Redirect to home page after login
        if (url.startsWith(baseUrl)) {
            return Promise.resolve(`${baseUrl}/`);
        }
        // Default behavior: redirect to the URL that was originally requested
        return Promise.resolve(url);
        },
    }
})