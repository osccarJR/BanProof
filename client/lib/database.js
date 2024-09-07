const mysql = require('mysql2');
const config = require('../config.json');


const connection = mysql.createConnection({
  host: config.proof_db.db_host,
  user: config.proof_db.db_user,
  password: config.proof_db.db_pass,
  database: config.proof_db.db_name,
});


const formatDateForMySQL = (date) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const connectToDatabase = async () => {

connection.connect((err) => {
  if (err) {
    console.error('Error conectandose a la base de datos:', err);
    return;
  }
  console.log('Se ha conectado a la base de datos');

  createPunishmentsTable();
});
};

const createPunishmentsTable = () => {
  const query = `
  CREATE TABLE IF NOT EXISTS punishments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    punishment_type ENUM('warn', 'mute', 'kick', 'ban') NOT NULL,
    punishment_id VARCHAR(255) NOT NULL,
    proof_type ENUM('url', 'video', 'image') NOT NULL,
    proof_content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_valid BOOLEAN DEFAULT FALSE,
    validated BOOLEAN DEFAULT FALSE
  );
  `;

  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error creando la tabla de sanciones:', err);
        return reject(err);
      }
      
      resolve(results);
    });
  });
};


const insertPunishment = (userId, punishmentType, punishmentId, proofType, proofContent, timestamp = new Date(), isValid = false, validated = false) => {
  const formattedTimestamp = formatDateForMySQL(timestamp);
  const query = `
    INSERT INTO punishments (user_id, punishment_type, punishment_id, proof_type, proof_content, timestamp, is_valid, validated)
    VALUES (?, ?, ?, ?, ?, ?, ?,?)
  `;

  return new Promise((resolve, reject) => {
    connection.query(query, [userId, punishmentType, punishmentId, proofType, proofContent, formattedTimestamp, isValid,validated], (err, results) => {
      if (err) {
        console.error('Error insertando informacion:', err);
        return reject(err);
      }
      console.log('Informacion insertada correctamente:', results.insertId);
      resolve(results);
    });
  });
};


const getPunishmentsByUserId = (userId) => {
  const query = `SELECT * FROM punishments WHERE user_id = ?`;

  return new Promise((resolve, reject) => {
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error obteniendo informacion:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};


const getPunishmentById = (id) => {
  const query = `SELECT * FROM punishments WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error obteniendo informacion:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};


const getPunishmentsByPunishmentId = (punishmentId) => {
  const query = `SELECT * FROM punishments WHERE punishment_id = ?`;

  return new Promise((resolve, reject) => {
    connection.query(query, [punishmentId], (err, results) => {
      if (err) {
        console.error('Error obteniendo informacion:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

const getPunishmentByTypeAndId = (punishmentType, punishmentId) => {
  const query = `SELECT * FROM punishments WHERE punishment_type = ? AND punishment_id = ?`;

  return new Promise((resolve, reject) => {
    connection.query(query, [punishmentType, punishmentId], (err, results) => {
      if (err) {
        console.error('Error obteniendo informacion:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};


const getAllPunishments = () => {
  const query = `SELECT * FROM punishments`;

  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error obteniendo informacion:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};




const deletePunishmentById = (id) => {
  const query = `DELETE FROM punishments WHERE id = ?`;

  return new Promise((resolve, reject) => {
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error eliminando informacion:', err);
        return reject(err);
      }
      console.log('Sanción eliminada:', results.affectedRows);
      resolve(results);
    });
  });
};


const closeConnection = () => {
  return new Promise((resolve, reject) => {
    connection.end((err) => {
      if (err) {
        console.error('Error terminando la conexion de la base de datos:', err);
        return reject(err);
      }
      console.log('Se ha terminado la conexion de la base de datos');
      resolve();
    });
  });
};


module.exports = {
  connection,
  connectToDatabase,
  createPunishmentsTable,
  insertPunishment,
  getPunishmentsByUserId,
  getPunishmentById,
  getPunishmentsByPunishmentId,
  getPunishmentByTypeAndId,
  getAllPunishments,
  deletePunishmentById,
  closeConnection,
};
