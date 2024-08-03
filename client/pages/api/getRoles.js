import axios from "axios";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: "No autenticado" });
    }

    const discordId = session.user.id;
    const accessToken = session.accessToken; // Debes asegurarte de guardar esto en el JWT en callbacks de NextAuth

    try {
        const response = await axios.get(`https://discord.com/api/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Filtra por el ID del servidor al que quieres verificar el rol
        const guild = response.data.find(g => g.id === "YOUR_GUILD_ID");

        if (guild) {
            // Realiza otra llamada para obtener los roles
            const memberResponse = await axios.get(`https://discord.com/api/guilds/YOUR_GUILD_ID/members/${discordId}`, {
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                },
            });

            return res.status(200).json({ roles: memberResponse.data.roles });
        } else {
            return res.status(404).json({ message: "No en el servidor" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener roles" });
    }
}