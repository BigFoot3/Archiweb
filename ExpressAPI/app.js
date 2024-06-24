const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

// Import des routes
const authRouter = require('./router/authRouter');
const userRouter = require('./router/userRouter');
const materialRouter = require('./router/materialRouter');
const requestRouter = require('./router/requestRouter');

const app = express();

// Sécuriser les headers avec Helmet pour protéger l'application des vulnérabilités HTTP
app.use(helmet());

// Utiliser cors pour permettre les requêtes cross-origin depuis le client spécifié
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser le corps des requêtes en JSON, essentiel pour les requêtes POST et PUT
app.use(express.json());

// Middleware pour vérifier le jeton JWT et attacher l'utilisateur à la requête
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error('Erreur de vérification JWT:', err);
                return res.status(403).json({ error: 'Accès interdit' });
            }
            req.user = user.user;
            next();
        });
    } else {
        res.status(401).json({ error: 'Accès non autorisé' });
    }
};

// Routes publiques pour l'authentification
app.use('/auth', authRouter);

// Middleware de vérification JWT pour les routes protégées
app.use('/api', verifyJWT);

// Routes protégées accessibles uniquement avec un JWT valide
app.use('/api/users', userRouter);
app.use('/api/materials', materialRouter);
app.use('/api/requests', requestRouter);

// Route de base pour vérifier si le serveur fonctionne
app.get('/', (_req, res) => {
    res.send('Bienvenue sur mon serveur Express!');
});

// Connexion à la base de données MongoDB avec gestion des erreurs
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connexion réussie à la base de données !"))
    .catch((error) => console.error("Erreur de connexion à la base de données :", error));

// Gestionnaire d'erreurs global pour attraper et traiter les erreurs non gérées
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Une erreur serveur s\'est produite!' });
});

module.exports = app;
