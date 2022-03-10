// Importation du Framework Express
const express = require('express')

// Appel du router avec la méthode mise à disposition par Express
const router = express.Router()

//* *****Ajout des middlewares***** *//
// On importe le middleware auth pour sécuriser les routes
const auth = require('../middleware/auth')
//On importe le middleware multer pour la gestion des images
const multer = require('../middleware/multer-config')
// On importe le middleware verifySauce qui pour la validation
const verifySauce = require('../middleware/verifySauce');

// On associe les fonctions aux différentes routes, on importe le controller
const sauceCtrl = require('../controllers/sauce')

//* *****Création des différentes ROUTES de l'API en leurs précisant, dans l'ordre, leurs middlewares et controllers***** *//
// Route qui permet de créer une sauce
router.post('/', auth, multer, sauceCtrl.createSauce)
// Route qui permet de modifier une sauce
router.put('/:id', auth, multer, verifySauce, sauceCtrl.modifySauce)
// Route qui permet de supprimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce)
// Route qui permet de récupérer une seule sauce
router.get('/:id', auth, sauceCtrl.getOneSauce)
// Route qui permet de récupérer toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces)
// Route qui permet de liker ou disliker une sauce
router.post('/:id/like', auth, sauceCtrl.likeOrNot)

// Nous exportons ensuite le router
module.exports = router