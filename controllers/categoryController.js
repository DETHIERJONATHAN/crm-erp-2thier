const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la r�cup�ration des cat�gories.' });
  }
};

exports.createCategory = async (req, res) => {
  const { name, sectorId } = req.body;
  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        sectorId
      }
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la cr�ation de la cat�gorie.' });
  }
};
