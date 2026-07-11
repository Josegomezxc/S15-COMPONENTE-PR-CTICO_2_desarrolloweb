import { Router } from 'express';
import { suscribir, listarSuscriptores } from '../controllers/newsletterController.js';
import { protegerRuta, esAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/subscribe', suscribir);
router.get('/subscribers', protegerRuta, esAdmin, listarSuscriptores);

export default router;
