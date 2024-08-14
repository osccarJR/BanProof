import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session || !session.accessToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id; 
    const guildId = process.env.DISCORD_GUILD_ID;

    try {
        const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            credentials: 'include', 
        });

        if (!memberResponse.ok) {
            const memberResponseText = await memberResponse.text();
            console.error('Failed to fetch member details:', memberResponseText);
            return res.status(memberResponse.status).json({ error: memberResponseText });
        }

        const memberData = await memberResponse.json();
        const roles = memberData.roles;

        res.status(200).json({ roles });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

