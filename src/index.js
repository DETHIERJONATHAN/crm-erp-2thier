const express = require('express');
const productRoutes = require('../routes/productRoutes');
const categoryRoutes = require('../routes/categoryRoutes');
const app = express();
const path = require('path');
const userRoutes = require('./routes/userRoutes');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use('/products', productRoutes);
app.use(userRoutes);

app.use('/categories', categoryRoutes);
app.listen(3000, () => console.log('Serveur en écoute sur le port 3000'));

