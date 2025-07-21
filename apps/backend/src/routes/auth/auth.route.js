import { Router } from 'express';
import AuthController from '../../controllers/auth/auth.controller.js';


const router = Router();

// /api/auth/register
router.post('/register', AuthController.register);

// /api/auth/login
router.post('/login', AuthController.login);

// /api/auth/logout
router.post('/logout', AuthController.logout);

// /api/auth/me
router.get('/me', AuthController.me);

export default router;
