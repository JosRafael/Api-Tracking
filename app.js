const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pixelController = require('./controllers/pixelController'); 

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.post('/process-payload', pixelController.processPayload);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
