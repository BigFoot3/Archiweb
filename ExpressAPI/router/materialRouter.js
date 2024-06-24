const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// Routes pour la gestion des matériaux
router.post('/', materialController.addMaterial);
router.get('/', materialController.getAllMaterials);
router.get('/:id', materialController.getMaterial);
router.put('/:id', materialController.updateMaterial);
router.delete('/:id', materialController.deleteMaterial);
router.post('/:id/assign', materialController.assignMaterial);
router.get('/assigned/:userId', materialController.getAssignedMaterials);
router.post('/:id/return', materialController.returnMaterial);
router.post('/:id/accept-assignment', materialController.acceptMaterialAssignment);

module.exports = router;
