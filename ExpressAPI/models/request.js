const mongoose = require('mongoose');

// Schéma de demande définissant les champs essentiels : utilisateur, matériel, localisation et statut
const requestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

// Modèle Request créé à partir du schéma défini, représentant une demande faite par un utilisateur
const Request = mongoose.model('Request', requestSchema);

// Exportation du modèle Request pour permettre son utilisation dans d'autres parties de l'application
module.exports = Request;