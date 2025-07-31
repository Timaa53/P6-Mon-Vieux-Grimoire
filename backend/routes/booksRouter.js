import express from 'express';
import * as booksCtrl from '../controllers/booksController.js';
import { authMW } from '../controllers/middleware/authMW.js';

const router = express.Router();


// GESTION BOOKCONTROLLER
// ROUTES GET (rating, bdd, id livre)
router.get('/bestrating', booksCtrl.bestRating);
router.get('/', booksCtrl.allBooks);
router.get('/:id', booksCtrl.getOneBook);
// ROUTES POST (livre, rating)
router.post('/', authMW, booksCtrl.addBook);
router.post('/:id/rating', authMW, booksCtrl.addRate);
// ROUTE PUT (livre)
router.put('/:id', authMW, booksCtrl.updateBook);
// ROUTE DELETE (livre)
router.delete('/:id', authMW, booksCtrl.deleteBook);


// GESTION AUTH.JS



export default router;