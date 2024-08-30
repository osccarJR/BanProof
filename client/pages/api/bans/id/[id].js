import mysql from 'mysql2/promise';

const config = require('../../../../config.json');
export default async function handler(req, res) {
    
    const pool = mysql.createPool({
        host: config.db_host,
        port: config.db_port || 3306,
        user: config.db_user,
        password: config.db_pass,
        database: config.db_name, 
        waitForConnections: true,
        connectionLimit: 10, 
        queueLimit: 0 
    });
    const { id } = req.query;

    try {

        const [row] = await pool.execute('SELECT * FROM litebans_bans WHERE id = ?', [id]);
        res.json(row[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo informacion de la base de datos' });
        console.log(error);
    } finally {
        pool.end();
    }
}
