import connectToDatabase from "@/lib/mongoose";
import Punishment from "@/models/Punishment";

export default async function handler(req, res) {
    await connectToDatabase();

    if(req.method === 'POST') {
        const { userId, proofType, proofContent, punishmentId, punishmentType } = req.body;


        console.log(req.body);
        
        if(!userId || !proofType || !proofContent || !punishmentId || !punishmentType) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const punishment = new Punishment({
            userId,
            punishmentType,
            punishmentId,
            proofType,
            proofContent,
        });

        await punishment.save();

        return res.status(201).json(punishment);
    } else {
        return res.status(405).json({ error: 'Método no permitido' });
    }
}