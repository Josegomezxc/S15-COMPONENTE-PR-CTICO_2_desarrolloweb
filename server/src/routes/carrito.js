import { Router } from 'express';
import {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
  vaciarCarrito
} from '../controllers/carritoController.js';
import { protegerRuta } from '../middleware/auth.js';

const router = Router();

router.use(protegerRuta);

router.get('/', obtenerCarrito);
router.post('/', agregarAlCarrito);
router.put('/:productoId', actualizarCantidad);
router.delete('/:productoId', eliminarDelCarrito);
router.delete('/', vaciarCarrito);

export default router;
