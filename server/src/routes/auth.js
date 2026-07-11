import { Router } from 'express';
import { registrar, login, perfil, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protegerRuta } from '../middleware/auth.js';
import { validarRegistro, validarLogin } from '../validations/authValidation.js';

const router = Router();

router.post('/register', validarRegistro, registrar);
router.post('/login', validarLogin, login);
router.get('/profile', protegerRuta, perfil);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
