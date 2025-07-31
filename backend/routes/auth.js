import express from 'express';
import * as authCtrl from '../controllers/authController.js';

const router = express.Router();

// ROUTES POST
// ROUTE POST SIGNUP
router.post('/signup', authCtrl.signUp);
// ROUTE POST LOGIN
router.post('/login', authCtrl.login);

export default router;
