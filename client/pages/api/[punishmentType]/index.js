import mysql from 'mysql2/promise';

const config = require('../../../config.json');
const db = require("../../../lib/database");
let punishmentType;

const handler = async (req, res) => {

    let punishmentType = req.query.punishmentType;
    
    const pool = mysql.createPool({
        host: config.litebans_db.db_host,
        port: config.litebans_db.db_port || 3306,
        user: config.litebans_db.db_user,
        password: config.litebans_db.db_pass,
        database: config.litebans_db.db_name,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {

        if(punishmentType.charAt(punishmentType.length - 1) === 's') {
            punishmentType = punishmentType.slice(0, -1);
        }
        const [rows] = await pool.execute(`SELECT * FROM litebans_${punishmentType}s ORDER BY time DESC`);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo informacion de la base de datos' });
        console.log(error);
    } finally {
        pool.end();
    }
};


export async function getServerSideProps(context) {

    punishmentType = context.params.punishmentType;
    await db.connectToDatabase();
    return {
        props: {
            punishmentType
        }
    }
}

export default handler;


