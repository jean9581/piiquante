/* *****Middleware qui permet d'assurer que les mots de passe sont assez sécurisés***** */

// On importe notre model passwordSchema
const passwordSchema = require('../models/password.js');

//* *****Midlleware verifyPassword***** *//
//Vérifie que le mot de passe valide le schema et le regex
module.exports = (req, res, next) => {
	const regexTrue = /[§!@#$%^&*().?{}|<>]/;
	const regexFalse = /[='":]/;
	if (
		!passwordSchema.validate(req.body.password) ||
		!regexTrue.test(req.body.password) ||
		regexFalse.test(req.body.password)
	) {
		res.writeHead(
			400,
			'{"message":"Mot de passe requis : 8 caractères minimun. Au moins 1 majuscule, 1 minuscule, 1 chiffre , un caractère spécial et sans espaces !"}',
			{
				'content-type': 'application/json',
			},
		);
		res.end('Format de mot de passe incorrect !');
	} else {
		next();
	}
};
//* //////////////////// verifyPassword END //////////////////// */
