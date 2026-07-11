import { Router } from 'express';
import { obtenerActividad } from '../controllers/activityController.js';
import { protegerRuta, esAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', protegerRuta, esAdmin, obtenerActividad);

export default router;
