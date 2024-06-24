const mongoose = require('mongoose');

// Schéma d'organisation définissant les champs essentiels : nom, adresse et email de contact
const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    contactEmail: String
});

// Modèle Organization créé à partir du schéma défini, représentant une organisation
const Organization = mongoose.model('Organization', organizationSchema);

// Exportation du modèle Organization pour permettre son utilisation dans d'autres parties de l'application
module.exports = Organization;