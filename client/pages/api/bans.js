import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: 3306, // Puedes mantener el puerto si es el predeterminado
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const [rows] = await connection.execute('SELECT * FROM litebans_bans ORDER BY time DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from database' });
    } finally {
        connection.end();
    }
}
