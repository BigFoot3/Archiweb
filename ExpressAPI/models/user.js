const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définition du schéma utilisateur avec des champs pour le nom d'utilisateur, le mot de passe et le rôle
// Le rôle a des valeurs possibles spécifiques : 'user', 'admin', 'organization'
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'organization'], default: 'user', required: true }
});

// Création du modèle utilisateur basé sur le schéma défini
const User = mongoose.model('User', userSchema);

// Exportation du modèle pour l'utiliser dans d'autres parties de l'application
module.exports = User;
