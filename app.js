const express = require('express');
const bodyParser = require('body-parser');
const pixelController = require('./controllers/pixelController'); // Importa o controlador

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/process-payload', pixelController.processPayload);
// app.post('/process-payload', pixelController.processPayload);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
