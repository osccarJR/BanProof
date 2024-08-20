import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Not estas autenticado' });
  }
  try {
    const response = await fetch(
      `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    const data = await response.json();
    const userRoles = data.roles;
    let roles = [];
    if (userRoles.includes('934220641727549490') || memberData.roles.includes('941000828511215636')) {
      roles.push("management");
    } else if (memberData.roles.includes('940339724118286399')) {
      roles.push("staff");
    }
    const rangos = {
      "Founder": "934105741420273765",
      "Owner": "1045127188128747560",
      "Manager": "1144741012145717339",
      "Admin": "1147977563105394799",
      "JrAdmin": "1214074487469899817",
      "SrMod": "1147977564837642376",
      "Moderator+": "1213962495333761105",
      "Moderator": "1147977568193085581",
      "Helper": "1147977652993540237"
    }
    for (const rango in rangos) {
      if (userRoles.includes(rangos[rango])) {
        roles.push(rango);
        break;
      }
    }

    res.status(200).json({ roles });
  } catch (error) {
    console.error("Error al obtener los roles:",error);
    res.status(500).json({ error: 'Error al obtener los roles' });
  }
    
}
