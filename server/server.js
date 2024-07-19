const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;

app.use(cors());

app.get('/', (req, res) => {
    res.redirect('/api/home');
});

app.get('/api/home', (req, res) => {
  res.json({ message: "Hola mundo!" , mejorserver: ["Watones", "Watones", "Watones"]});
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});