const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const winston = require('winston');

// Configurer le logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'auth-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/auth-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/auth-combined.log' })
  ]
});

// Enregistrement d'un nouvel utilisateur
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      logger.warn('Utilisateur existe déjà', { username });
      return res.status(400).json({ msg: 'L\'utilisateur existe déjà' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ username, password: hashedPassword, role: 'user' });
    await user.save();
    logger.info('Utilisateur enregistré avec succès', { userId: user._id });
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    logger.error('Erreur lors de l\'enregistrement de l\'utilisateur', { error: error.message });
    res.status(500).send('Erreur serveur');
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn('Identifiants invalides - utilisateur non trouvé', { username });
      return res.status(400).json({ msg: 'Identifiants invalides' });
    }
    logger.info('Utilisateur trouvé', { userId: user._id });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Identifiants invalides - mot de passe incorrect', { username });
      return res.status(400).json({ msg: 'Identifiants invalides' });
    }
    logger.info('Utilisateur connecté avec succès', { userId: user._id });
    const payload = { user: { id: user.id, role: user.role } }; // Inclure le rôle dans le payload
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    logger.error('Erreur lors de la connexion de l\'utilisateur', { error: error.message });
    res.status(500).send('Erreur serveur');
  }
};