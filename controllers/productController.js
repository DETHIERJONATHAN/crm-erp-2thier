const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits.' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, categoryId, price } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        categoryId,
        price
      }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du produit.' });
  }
};
