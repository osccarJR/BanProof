
import { connection } from '../../lib/database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { punishment_id, punishment_type, isValid , validated} = req.body;
    

    const query = `UPDATE punishments SET is_valid = ?, validated = ? WHERE punishment_id = ? AND punishment_type = ?`;

    connection.query(query, [isValid, validated, punishment_id, punishment_type], (err, results) => {
      if (err) {
        console.error('Error actualizando validez:', err);
        return res.status(500).json({ error: 'Error actualizando validez' });
      }
      console.log('Validez y validacion actualizadas:', results.affectedRows);
      res.status(200).json({ success: true, affectedRows: results.affectedRows });
      
    });
  } else {
    res.status(405).json({ message: 'Metodo no permitido' });
  }
}
