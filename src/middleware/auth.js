// Middleware pour vérifier le token JWT et le rôle admin
const jwt = require('jsonwebtoken');

// Vérifie que l'utilisateur est authentifié
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
}

// Vérifie que l'utilisateur est admin
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
