const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// Route pour l'enregistrement
router.post('/register', register);

// Route pour la connexion
router.post('/login', login);

module.exports = router;
