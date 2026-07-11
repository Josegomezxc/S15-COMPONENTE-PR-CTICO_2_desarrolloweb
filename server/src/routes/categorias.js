import { Router } from 'express';
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/categoriaController.js';
import { protegerRuta, esAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', obtenerCategorias);
router.post('/', protegerRuta, esAdmin, crearCategoria);
router.put('/:id', protegerRuta, esAdmin, actualizarCategoria);
router.delete('/:id', protegerRuta, esAdmin, eliminarCategoria);

export default router;
