const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes pour la gestion des utilisateurs
router.post('/', userController.addUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id', userController.updateUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserDetails);

module.exports = router;
