import { optimizeImage } from '../utils/optimizeImage.js';

export const sharpOptimizer = async (req, res, next) => {
    if (!req.file)
        return next();

    try {
        const filename = await optimizeImage(req.file.buffer, req.file.originalname);

        req.file.filename = filename;

        next();
    } catch(error) {
        res.status(500).json({ message: "Erreur dans l'optimisation de l'image", error });
    }
};