// Importation du Framework Express
const express = require('express');
// Importation du package body-parser qui permet d'extraire l'objet JSON des requêtes POST
const bodyParser = require('body-parser');
// Importation du package Helmet vous aide à protéger votre application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.
const helmet = require('helmet');
// Importation du package mongoose pour se connecter à la data base mongo Db
const mongoose = require('mongoose');
// Importation du package qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const path = require('path');

//const cors = require("cors")

//const { json } = require('express/lib/response');

// utilisation du package dotenv pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require('dotenv').config();

//* *****Déclaration des routes***** *//
// On importe la route dédiée aux sauces
const saucesRoutes = require('./routes/sauce');
// On importe la route dédiée aux utilisateurs
const userRoutes = require('./routes/user');

//mangoos
const uri = process.env.DB_URI
mongoose
    .connect(uri,
        { useNewUrlParser: true,
          useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

// Création d'une application express   
const app = express()

// Middleware Header qui permet à toutes les demandes de toutes les origines d'accéder à l'API
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS',
	);
	next();
});

//app.use(cors())

// Middleware qui permet de transformer le corp de la requête en un objet JSON utilisable
app.use(bodyParser.json())

// Helmet aide à protéger de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.
app.use(helmet());

// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes dédiées aux sauces
app.use('/api/sauces', saucesRoutes);

// Routes dédiées aux users
app.use('/api/auth', userRoutes);

// Export de l'application express pour y accéder depuis server.js
module.exports = app;