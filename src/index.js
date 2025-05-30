require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => res.send(' Serveur CRM/ERP opérationnel'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(' Serveur en écoute sur le port ' + PORT));
