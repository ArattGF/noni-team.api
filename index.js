const express = require('express');
const app = express();
const port = 3000;

// Verificación del webhook
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'mi_token_secreto') {
    console.log('Webhook verificado');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Fallo la verificación');
    res.sendStatus(403);
  }
});

// Manejar mensajes entrantes
app.post('/webhook', (req, res) => {
  // Tu lógica para procesar mensajes
  console.log('Mensaje recibido:', req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});