const db = require('../../lib/database');

export default async function handler(req, res) {
    

    if(req.method === 'POST') {
        const { userId, proofType, proofContent, punishmentId, punishmentType } = req.body;


        
        
        if(!userId || !proofType || !proofContent || !punishmentId || !punishmentType) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const timestamp = new Date();
        const isValid = false;
        let punishment = [];
        try {
            punishment = db.insertPunishment(userId, punishmentType, punishmentId, proofType, proofContent, timestamp, isValid);
        } catch (error) {
            console.error('Error insertando prueba:', error);
            alert('Error insertando prueba');
            return res.status(500).json({ error: 'Error insertando prueba' });
        }
        

        return res.status(201).json(punishment);
    } else {
        return res.status(405).json({ error: 'Método no permitido' });
    }
}