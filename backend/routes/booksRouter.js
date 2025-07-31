import express from 'express';
import * as booksCtrl from '../controllers/booksController.js';

const router = express.Router();

// ROUTES GET (rating, bdd, id livre)
router.get('/bestrating', booksCtrl.bestRating);
router.get('/', booksCtrl.allBooks);
router.get('/:id', booksCtrl.getOneBook);

// ROUTES POST (livre, rating)
router.post('/', booksCtrl.addBook);
router.post('/:id/rating', booksCtrl.addRate);

// ROUTE PUT (livre)
router.put('/:id', booksCtrl.updateBook);

// ROUTE DELETE (livre)
router.delete('/:id', booksCtrl.deleteBook);

export default router;