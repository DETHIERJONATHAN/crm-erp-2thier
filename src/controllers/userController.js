const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  // Vérification de la présence de l'email, du mot de passe et du rôle (optionnel)
  const { email, password, role } = req.body;
  if (!email || !password) {
    // On retourne une erreur si un champ est manquant
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // On empêche la création d'un doublon
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }
    // Hash du mot de passe
    const hash = await bcrypt.hash(password, 10);
    // Création de l'utilisateur avec le rôle (par défaut 'user' si non fourni)
    const user = await prisma.user.create({ data: { email, password: hash, role: role || 'user' } });
    // On ne renvoie pas le mot de passe dans la réponse
    res.status(201).json({ message: 'Utilisateur créé', user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    // Gestion des erreurs serveur
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  // Vérification de la présence de l'email et du mot de passe
  const { email, password } = req.body;
  if (!email || !password) {
    // On retourne une erreur si un champ est manquant
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }
  try {
    // Recherche de l'utilisateur par email
    const user = await prisma.user.findUnique({ where: { email } });
    // Vérification de l'existence de l'utilisateur et du mot de passe
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    // Génération du token JWT avec le rôle inclus dans le payload
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    // On ne renvoie pas le mot de passe dans la réponse
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email || '',
        role: user.role || ''
      }
    });
  } catch (err) {
    // Gestion des erreurs serveur
    res.status(500).json({ error: err.message });
  }
};

// Contrôleur pour retourner la liste de tous les utilisateurs (admin uniquement)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
