import { Router } from 'express';
import { obtenerPerfil, actualizarPerfil, cambiarPassword } from '../controllers/usuarioController.js';
import { protegerRuta } from '../middleware/auth.js';

const router = Router();

router.use(protegerRuta);

router.get('/perfil', obtenerPerfil);
router.put('/perfil', actualizarPerfil);
router.put('/cambiar-password', cambiarPassword);

export default router;
