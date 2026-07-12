import { Router } from 'express';
import { enviarMensaje, listarMensajes, obtenerMensaje, misMensajes, misMensajesCount, mensajesPendientesCount, responderMensaje } from '../controllers/contactoController.js';
import { protegerRuta, esAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', enviarMensaje);
router.get('/', protegerRuta, esAdmin, listarMensajes);
router.get('/mis-mensajes', protegerRuta, misMensajes);
router.get('/mis-mensajes/count', protegerRuta, misMensajesCount);
router.get('/pendientes/count', protegerRuta, esAdmin, mensajesPendientesCount);
router.get('/:id', protegerRuta, esAdmin, obtenerMensaje);
router.put('/:id/responder', protegerRuta, esAdmin, responderMensaje);

export default router;
