/* *****Model passwordSchema***** */

// On importe le package passwordValidator 
const passwordValidator = require('password-validator');

// On crée un objet passwordSchema
const passwordSchema = new passwordValidator();

passwordSchema
	.is().min(8) // Longueur minimun : 8
	.is().max(40) // Longueur max : 40
	.has().uppercase() // Doit avoir au moins une majuscule
	.has().lowercase() // Doit avoir au moins une minuscule
	.has().digits() // Doit avoir au moins un chiffre
	.has().not().spaces() // Ne doit pas avoir d'espaces
	.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist de valeurs à proscrire

// Nous exportons ensuite le modèle passwordSchema 
module.exports = passwordSchema;
