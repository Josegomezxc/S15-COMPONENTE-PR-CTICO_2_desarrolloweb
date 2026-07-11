import { Router } from 'express';
import { obtenerPerfil, actualizarPerfil, cambiarPassword, listarUsuarios } from '../controllers/usuarioController.js';
import { protegerRuta, esAdmin } from '../middleware/auth.js';

const router = Router();

router.use(protegerRuta);

router.get('/perfil', obtenerPerfil);
router.put('/perfil', actualizarPerfil);
router.put('/cambiar-password', cambiarPassword);
router.get('/', esAdmin, listarUsuarios);

export default router;
