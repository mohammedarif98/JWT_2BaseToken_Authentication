
import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { getUser } from '../controllers/user.controller.js';


const router = express.Router();


router.get('/get-user', authenticateUser, getUser);



export default router;