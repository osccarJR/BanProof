const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const PORT = 8070;

app.use(cors());

app.get('/', (req, res) => {
    res.redirect('/api/home');
});

app.get('/api/home', (req, res) => {
  res.json({ message: "Hola mundo!" , mejorserver: ["Watones", "Watones", "Watones"]});
});

app.get('/api/punishments', (req, res) => {
    //get params
    const { username } = req.query;
    http.get(`http://localhost:8080/punishments?username=${username}`, (response) => {
      res.json(response);
      
    }).on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });


});





app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});