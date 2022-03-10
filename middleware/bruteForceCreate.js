/* *****Middleware qui permet de restreindre le nombre de création de compte***** */

// On importe le package express-rate-limit
const bruteForceCreate = require('express-rate-limit');

//* *****Midlleware bruteForceCreate***** *//
// 5 création de compte maximum à partir d'une même adresse IP avant d'être bloqué 1 heure
module.exports = bruteForceCreate({
	windowMs: 60 * 60 * 1000,
	max: 5,
	message:
		"Trop de comptes créés à partir de cette adresse IP, veuillez réessayer dans une heure !",
});
//* //////////////////// bruteForceCreate END //////////////////// */
