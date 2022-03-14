const Sauce = require('../models/sauce')
const fs = require('fs')

//* *****Permet de récupérer toutes les sauces***** *//
// On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base, l'array de toutes les sauves de la base de données
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(400).json({ error }))
}
//* //////////////////// getAllSauce END //////////////////// */
//* *****Permet de récupérer une sauce***** *//
// On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => res.status(200).json(sauce))
		.catch(error => res.status(404).json({ error }))
}
//* //////////////////// getOneSauce END //////////////////// */

//* *****Permet de créer une nouvelle sauce***** *//
// On crée un object sauceObjet qui stocke les données envoyées par le front-end en les transformant en objet js
// On supprime l'id généré automatiquement et envoyé par le front-end.
// On crée ensuite une instance Sauce à partir de sauceObjet
// On traite l'image
// On valide les champs à l'aide de regex
// Sauvegarde de la sauce dans la base de données
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
	});
	const regex = /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ.?!,_\s-]{3,150}$/;
	if (
		!regex.test(sauceObject.name) ||
		!regex.test(sauceObject.manufacturer) ||
		!regex.test(sauceObject.description) ||
		!regex.test(sauceObject.mainPepper)
	) {
		const filename = sauce.imageUrl.split('/images/')[1];
		fs.unlinkSync(`images/${filename}`);
		res.writeHead(
			400,
			'{"message":"Vous devez utiliser entre 3 et 150 caractères, et ne pas utiliser de caractères spéciaux !"}',
			{
				'content-type': 'application/json',
			},
		);
		res.end('Format sauce incorrect !');
	} else {
		sauce
			.save()
			.then(() => res.status(201).json({ message: 'Objet renregistré !' }))
			.catch(error => res.status(400).json({ error }));
	}
};
//* //////////////////// createSauce END //////////////////// */

//* *****Permet de modifier une sauce***** *//
// On crée un objet sauceObjet qui regarde si req.file existe ou non
// S'il existe, on traite la nouvelle image
// S'il n'existe pas, on traite l'objet entrant
// On effectue la modification
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }))
}
//* //////////////////// modifySauce END //////////////////// */

//* *****Permet de supprimer une sauce***** *//
// On va chercher l'objet Sauce pour obtenir l'url de l'image et supprimer le fichier image de la base
// Nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier
// Nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			const filename = sauce.imageUrl.split('/images/')[1]
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Objet supprimé !' }))
					.catch(error => res.status(400).json({ error }))
			})
		})
		.catch(error => res.status(500).json({ error }))
}
//* //////////////////// deleteSauce END //////////////////// */

//* *****Permet de liker, disliker une sauce***** *//
exports.likeOrNot = (req, res, next) => {
	// Si il s'agit de mettre un like
    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }))
	// S'il s'agit de mettre un dislike
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
				// S'il s'agit de retirer un dislike
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                // S'il s'agit de retirer un dislike        
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
}
//* //////////////////// likeDislikeSauce END //////////////////// */