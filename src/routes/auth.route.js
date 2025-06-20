import express from 'express';
import { login, logout, refreshAccessToken, register } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';


const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateUser, logout);
router.post('/refresh-token', refreshAccessToken);



export default router;