const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Routes pour la gestion des demandes
router.get('/', requestController.getAllRequests);
router.post('/', requestController.createRequest);
router.put('/:id/approve', requestController.approveRequest);
router.put('/:id/reject', requestController.rejectRequest);

module.exports = router;
