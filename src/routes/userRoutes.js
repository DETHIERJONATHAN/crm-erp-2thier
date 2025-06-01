const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);

module.exports = router;
