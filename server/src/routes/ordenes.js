import { Router } from 'express';
import {
  crearOrden,
  obtenerOrdenes,
  obtenerOrden,
  obtenerTodasOrdenes,
  actualizarEstadoOrden
} from '../controllers/ordenController.js';
import { protegerRuta, esAdmin } from '../middleware/auth.js';

const router = Router();

router.use(protegerRuta);

router.post('/', crearOrden);
router.get('/', obtenerOrdenes);
router.get('/todas', esAdmin, obtenerTodasOrdenes);
router.get('/:id', obtenerOrden);
router.put('/:id/estado', esAdmin, actualizarEstadoOrden);

export default router;
