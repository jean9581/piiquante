/* *****Middleware qui permet d'assurer que le nombre de caractères ne dépassent pas les recommandations et de restreindre le type de symboles utilisables***** */

//* *****Midlleware verifySauce***** *//
//Vérifie que les inputs valide le regex
module.exports = (req, res, next) => {
	const regex = /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ.?!,_\s-]{3,150}$/;
	if (
		!regex.test(req.body.name) ||
		!regex.test(req.body.manufacturer) ||
		!regex.test(req.body.description) ||
		!regex.test(req.body.mainPepper)
	) {
		res.writeHead(
			400,
			'{"message":"Vous devez utiliser entre 3 et 150 caractères, et ne pas utiliser de caractères spéciaux !"}',
			{
				'content-type': 'application/json',
			},
		);
		res.end('Format sauce incorrect !');
	} else {
		next();
	}
};
//* //////////////////// verifySauce END //////////////////// */