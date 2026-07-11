import { Router } from 'express';
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productoController.js';
import { protegerRuta, esAdmin } from '../middleware/auth.js';
import { validarProducto } from '../validations/productoValidation.js';

const router = Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);
router.post('/', protegerRuta, esAdmin, validarProducto, crearProducto);
router.put('/:id', protegerRuta, esAdmin, actualizarProducto);
router.delete('/:id', protegerRuta, esAdmin, eliminarProducto);

export default router;
