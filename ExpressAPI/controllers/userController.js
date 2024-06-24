const User = require('../models/user');
const bcrypt = require('bcryptjs');
const winston = require('winston');

// Configuration de Winston pour la journalisation des événements et des erreurs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'service-utilisateur' },
  transports: [
    new winston.transports.File({ filename: 'logs/user-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/user-combined.log' })
  ]
});

// Fonction pour ajouter un nouvel utilisateur avec vérification des privilèges admin
exports.addUser = async (req, res) => {
  if (req.user.role !== 'admin') {
    logger.warn('Tentative non autorisée d\'ajout d\'utilisateur', { user: req.user.id });
    return res.status(403).send('Accès refusé');
  }

  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    logger.info('Nouvel utilisateur ajouté', { userId: user._id, role });
    res.status(201).json(user);
  } catch (error) {
    logger.error('Échec de l\'ajout de l\'utilisateur', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour supprimer un utilisateur avec vérification des privilèges admin
exports.deleteUser = async (req, res) => {
  if (req.user.role !== 'admin') {
    logger.warn('Tentative non autorisée de suppression d\'utilisateur', { userId: req.params.id });
    return res.status(403).send('Accès refusé');
  }

  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      logger.warn('Utilisateur non trouvé lors de la suppression', { userId });
      return res.status(404).send('Utilisateur non trouvé');
    }
    logger.info('Utilisateur supprimé avec succès', { userId });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    logger.error('Erreur lors de la suppression de l\'utilisateur', { userId, error: error.message });
    res.status(500).send("Erreur lors de la suppression de l'utilisateur : " + error.message);
  }
};

// Fonction pour obtenir les détails d'un utilisateur spécifique
exports.getUserDetails = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      logger.warn('Utilisateur non trouvé lors de la récupération des détails', { userId });
      return res.status(404).send('Utilisateur non trouvé');
    }
    logger.info('Détails de l\'utilisateur récupérés avec succès', { userId });
    res.json(user);
  } catch (error) {
    logger.error('Erreur lors de la récupération des détails de l\'utilisateur', { userId, error: error.message });
    res.status(500).send("Erreur lors de la récupération des détails de l'utilisateur : " + error.message);
  }
};

// Fonction pour obtenir la liste de tous les utilisateurs sans leur mot de passe
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    logger.error('Erreur lors de la récupération des utilisateurs', { error: error.message });
    res.status(500).send("Erreur lors de la récupération des utilisateurs : " + error.message);
  }
};

// Fonction pour mettre à jour un utilisateur spécifique, principalement pour son rôle
exports.updateUser = async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn('Utilisateur non trouvé lors de la mise à jour', { userId });
      return res.status(404).send('Utilisateur non trouvé');
    }
    if (role) {
      user.role = role;
    }
    await user.save();
    logger.info('Utilisateur mis à jour avec succès', { userId });
    res.json({ message: 'Utilisateur mis à jour avec succès', user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de l\'utilisateur', { userId, error: error.message });
    res.status(500).send("Erreur lors de la mise à jour de l'utilisateur : " + error.message);
  }
};
