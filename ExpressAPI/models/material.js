const mongoose = require('mongoose');

// Schéma de matériel définissant les champs nécessaires et leurs types
// Le matériel comprend un nom, un type, un statut (avec des valeurs possibles), une localisation par défaut, et des informations d'assignation
const materialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['stocked', 'used', 'in progress'], required: true },
    location: { type: String, default: 'Salle informatique' },
    assignedTo: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        type: { type: String, enum: ['User', 'Organization'] }
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedAt: { type: Date, default: Date.now }
});

// Modèle représentant un matériel, créé à partir du schéma défini
const Material = mongoose.model('Material', materialSchema);

// Exportation du modèle pour utilisation dans l'application
module.exports = Material; 