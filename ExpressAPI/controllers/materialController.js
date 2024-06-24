const Material = require('../models/material');
const User = require('../models/user');
const Organization = require('../models/organization');
const winston = require('winston');

// Configuration de Winston pour la journalisation des événements et des erreurs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'material-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/material-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/material-combined.log' })
  ]
});

// Méthode pour ajouter un nouveau matériel
exports.addMaterial = async (req, res) => {
  try {
    const newMaterial = new Material({
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      status: req.body.status,
      assignedTo: {
        id: process.env.DEFAULT_ORG_ID,
        type: 'Organization'
      }
    });
    const savedMaterial = await newMaterial.save();
    logger.info('Nouveau matériel ajouté', { materialId: savedMaterial._id });
    res.status(201).json(savedMaterial);
  } catch (error) {
    logger.error('Échec de l\'ajout du matériel', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Méthode pour récupérer un matériel par son ID
exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate('assignedTo.id');
    if (!material) {
      return res.status(404).send('Matériel non trouvé');
    }
    res.json(material);
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération du matériel : " + error.message);
  }
};

// Méthode pour gérer le retour de matériel
exports.returnMaterial = async (req, res) => {
  const materialId = req.params.id;

  try {
    const material = await Material.findById(materialId);
    if (!material) {
      logger.warn('Matériel non trouvé lors du retour', { materialId });
      return res.status(404).send('Matériel non trouvé');
    }

    material.assignedTo = {
      id: process.env.DEFAULT_ORG_ID,
      type: 'Organization'
    };
    material.status = 'stocked';
    material.location = 'Salle informatique';
    await material.save();
    logger.info('Matériel retourné avec succès', { materialId });
    res.json({ message: 'Matériel retourné avec succès', material });
  } catch (error) {
    logger.error('Erreur lors du retour du matériel', { materialId, error: error.message });
    res.status(500).json({ message: 'Erreur lors du retour du matériel : ' + error.message });
  }
};

// Méthode pour mettre à jour un matériel
exports.updateMaterial = async (req, res) => {
  const { name, type, status, location } = req.body;
  const materialId = req.params.id;
  
  try {
    const material = await Material.findByIdAndUpdate(materialId, {
      name,
      type,
      status,
      location
    }, { new: true });

    if (!material) {
      logger.warn('Matériel non trouvé lors de la mise à jour', { materialId });
      return res.status(404).send('Matériel non trouvé');
    }

    logger.info('Matériel mis à jour avec succès', { materialId });
    res.json(material);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour du matériel', { materialId, error: error.message });
    res.status(500).send("Erreur lors de la mise à jour du matériel : " + error.message);
  }
};

// Méthode pour supprimer un matériel
exports.deleteMaterial = async (req, res) => {
  const materialId = req.params.id;

  try {
    const material = await Material.findByIdAndDelete(materialId);
    if (!material) {
      logger.warn('Matériel non trouvé lors de la suppression', { materialId });
      return res.status(404).send('Matériel non trouvé');
    }

    logger.info('Matériel supprimé avec succès', { materialId });
    res.json({ message: 'Matériel supprimé avec succès' });
  } catch (error) {
    logger.error('Erreur lors de la suppression du matériel', { materialId, error: error.message });
    res.status(500).json({ message: 'Erreur lors de la suppression du matériel : ' + error.message });
  }
};

// Méthode pour assigner un matériel à un utilisateur ou une organisation
exports.assignMaterial = async (req, res) => {
  const { assigneeId, assigneeType, location } = req.body;
  const materialId = req.params.id;

  try {
    const material = await Material.findById(materialId);
    if (!material) {
      logger.warn('Matériel non trouvé lors de l\'assignation', { materialId });
      return res.status(404).send('Matériel non trouvé');
    }

    material.assignedTo = {
      id: assigneeId,
      type: assigneeType
    };
    material.status = 'used';
    material.location = location;

    await material.save();
    logger.info('Matériel assigné avec succès', { materialId, assigneeId, assigneeType, location });
    res.json({ message: 'Matériel assigné avec succès', material });
  } catch (error) {
    logger.error('Erreur lors de l\'assignation du matériel', { materialId, error: error.message });
    res.status(500).send("Erreur lors de l'assignation du matériel : " + error.message);
  }
};

// Méthode pour obtenir les matériels assignés à un utilisateur
exports.getAssignedMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ 'assignedTo.id': req.params.userId }).populate('assignedTo.id');
    if (!materials.length) {
      return res.status(404).send('Aucun matériel trouvé pour cet utilisateur');
    }
    res.json(materials);
  } catch (error) {
    logger.error('Erreur lors de la récupération des matériels assignés', { userId: req.params.userId, error: error.message });
    res.status(500).send("Erreur lors de la récupération des matériels assignés : " + error.message);
  }
};
  
// Méthode pour obtenir tous les matériels
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find({}).populate('assignedTo.id');
    logger.info('Tous les matériels récupérés', { count: materials.length });
    res.json(materials);
  } catch (error) {
    logger.error('Échec de la récupération des matériels', { error: error.message });
    res.status(500).send("Échec de la récupération des matériels : " + error.message);
  }
};

// Méthode pour accepter une demande d'attribution de matériel
exports.acceptMaterialAssignment = async (req, res) => {
  const { materialId, userId, organizationId } = req.body;

  try {
    const material = await Material.findById(materialId);
    if (!material) {
      logger.warn('Matériel non trouvé lors de l\'acceptation de l\'assignation', { materialId });
      return res.status(404).send('Matériel non trouvé');
    }

    if (material.status === 'used') {
      logger.warn('Matériel déjà assigné et en cours d\'utilisation', { materialId });
      return res.status(400).send('Le matériel est déjà assigné et en cours d\'utilisation');
    }

    material.assignedTo.id = userId || organizationId;
    material.assignedTo.type = userId ? 'User' : 'Organization';
    material.status = 'used';
    
    await material.save();

    const assigneeModel = userId ? User : Organization;
    const assigneeId = userId || organizationId;

    const assignee = await assigneeModel.findById(assigneeId);
    if (!assignee) {
      logger.warn('Bénéficiaire non trouvé', { assigneeId });
      return res.status(404).send('Bénéficiaire non trouvé');
    }

    assignee.materials = assignee.materials || [];
    assignee.materials.push(material._id);

    await assignee.save();
    logger.info('Assignation du matériel acceptée', { materialId, assigneeId });
    res.json({
      message: 'Assignation du matériel acceptée avec succès',
      material,
      assignee
    });
  } catch (error) {
    logger.error('Erreur lors de l\'acceptation de l\'assignation du matériel', { materialId, error: error.message });
    res.status(500).send("Erreur lors de l'acceptation de l'assignation du matériel : " + error.message);
  }
};
