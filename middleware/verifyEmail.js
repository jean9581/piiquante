/* *****Middleware qui permet d'assurer que les emails sont valides***** */

// On importe le package email-validator qui permet de vérifier si le format de l'email est valide
const validator = require('email-validator');

//* *****Midlleware verifyEmail***** *//
// Vérifie que l'email est valide
module.exports = (req, res, next) => {
	const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (!validator.validate(req.body.email) || !regexEmail.test(req.body.email)) {
		res.writeHead(400, '{"message":"Veuillez utiliser un email valide !"}', {
			'content-type': 'application/json',
		});
		res.end('Email invalid');
	} else {
		next();
	}
};
//* //////////////////// verifyEmail END //////////////////// */
