const Request = require('../models/request');
const Material = require('../models/material');
const winston = require('winston');

// Configuration de Winston pour la journalisation des événements et des erreurs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'service-des-demandes' },
  transports: [
    new winston.transports.File({ filename: 'logs/request-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/request-combined.log' })
  ]
});

// Fonction pour créer une nouvelle demande
// Met à jour le statut du matériel et crée une demande associée
exports.createRequest = async (req, res) => {
  const { materialId, location } = req.body;
  const userId = req.user.id;

  try {
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Matériel non trouvé' });
    }

    // Mettre à jour le statut du matériel à 'in progress'
    material.status = 'in progress';
    await material.save();

    const newRequest = new Request({
      user: userId,
      material: materialId,
      location
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Échec de la création de la demande', error: error.message });
  }
};

// Fonction pour récupérer toutes les demandes
// Inclut les informations des matériaux et des utilisateurs associés
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('material').populate('user');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Échec de la récupération des demandes', error: error.message });
  }
};

// Fonction pour approuver une demande
// Met à jour le matériel, assigne le matériel à un utilisateur et supprime la demande
exports.approveRequest = async (req, res) => {
  const { id } = req.params;
  const { materialId, userId } = req.body;

  try {
    logger.info('Approbation de la demande', { requestId: id, materialId, userId });

    const request = await Request.findById(id);
    if (!request) {
      logger.warn('Demande non trouvée', { requestId: id });
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    const material = await Material.findById(materialId);
    if (!material) {
      logger.warn('Matériel non trouvé', { materialId });
      return res.status(404).json({ message: 'Matériel non trouvé' });
    }

    material.assignedTo.id = userId;
    material.assignedTo.type = 'User';
    material.status = 'used';
    material.location = request.location;

    logger.info('Sauvegarde du matériel mis à jour', { materialId: material._id });
    await material.save();

    logger.info('Suppression de la demande', { requestId: id });
    await Request.findByIdAndDelete(id);

    res.json({ message: 'Demande approuvée avec succès' });
  } catch (error) {
    logger.error('Échec de l\'approbation de la demande', { error: error.message });
    res.status(500).json({ message: 'Échec de l\'approbation de la demande', error: error.message });
  }
};

// Fonction pour rejeter une demande
// Supprime la demande sans changer le statut du matériel
exports.rejectRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findById(id);
    if (!request) {
      logger.warn('Demande non trouvée', { requestId: id });
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    await Request.findByIdAndDelete(id);
    res.json({ message: 'Demande rejetée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Échec du rejet de la demande', error: error.message });
  }
};
