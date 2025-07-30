import express from 'express';
// import Book from '../models/Books';

const router = express.Router();

// ROUTES POST
// ROUTE POST SIGNUP
router.post('/signup', (req, res) => {
  res.json({ message: 'signup' });
});
// ROUTE POST LOGIN
router.post('/login', (req, res) => {
  res.json({ message: 'login' });
});

export default router;
// ///////////////ATTENTION ICI LA ROUTE EST /API/AUTH //////////////////////
