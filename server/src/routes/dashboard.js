import { Router } from 'express';
import { obtenerStats } from '../controllers/dashboardController.js';
import { protegerRuta, esAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/stats', protegerRuta, esAdmin, obtenerStats);

export default router;
