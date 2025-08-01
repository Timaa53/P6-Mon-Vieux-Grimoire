import express from 'express';
import * as booksCtrl from '../controllers/booksController.js';
import { authMW } from '../controllers/middleware/authMW.js';
import {uploadImages} from '../controllers/middleware/multerConfig.js';


const router = express.Router();


// GESTION BOOKCONTROLLER
// ROUTES GET (rating, bdd, id livre)
router.get('/bestrating', booksCtrl.bestRating);
router.get('/', booksCtrl.allBooks);
router.get('/:id', booksCtrl.getOneBook);
// ROUTES POST (livre, rating)
router.post('/', authMW, uploadImages, booksCtrl.addBook);
router.post('/:id/rating', authMW, booksCtrl.addRate);
// ROUTE PUT (livre)
router.put('/:id', authMW, uploadImages, booksCtrl.updateBook);
// ROUTE DELETE (livre)
router.delete('/:id', authMW, booksCtrl.deleteBook);

export default router;
