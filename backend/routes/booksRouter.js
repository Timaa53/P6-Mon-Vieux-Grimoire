import express from 'express';
import { authMW } from '../middleware/authMW.js';
import { uploadImage } from '../middleware/uploadImage.js';
import { sharpOptimizer } from '../middleware/sharpOptimizer.js';
import * as booksCtrl from '../controllers/booksController.js';


const router = express.Router();


// GESTION BOOKCONTROLLER
// ROUTES GET (rating, bdd, id livre)
router.get('/bestrating', booksCtrl.bestRating);
router.get('/', booksCtrl.allBooks);
router.get('/:id', booksCtrl.getOneBook);
// ROUTES POST (livre, rating)
router.post('/', authMW, uploadImage, sharpOptimizer, booksCtrl.addBook);
router.post('/:id/rating', authMW, booksCtrl.addRate);
// ROUTE PUT (livre)
router.put('/:id', authMW, uploadImage, sharpOptimizer, booksCtrl.updateBook);
// ROUTE DELETE (livre)
router.delete('/:id', authMW, booksCtrl.deleteBook);

export default router;
