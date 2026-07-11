import Orden from '../models/Orden.js';
import Usuario from '../models/Usuario.js';

export const obtenerActividad = async (req, res) => {
  try {
    const [ordenesRecientes, usuariosRecientes] = await Promise.all([
      Orden.find().sort({ createdAt: -1 }).limit(10).populate('usuario', 'nombre email'),
      Usuario.find().sort({ createdAt: -1 }).limit(5).select('nombre email createdAt')
    ]);

    const actividad = [];

    ordenesRecientes.forEach((o) => {
      const tiempo = Math.floor((Date.now() - new Date(o.createdAt)) / 60000);
      actividad.push({
        tipo: 'orden',
        accion: o.estado === 'enviado' ? 'enviado' : o.estado === 'entregado' ? 'entregado' : 'creada',
        texto: `Orden #${o._id.toString().slice(-6).toUpperCase()}`,
        detalle: o.estado === 'enviado' ? 'Pedido enviado' : o.estado === 'entregado' ? 'Pedido entregado' : o.estado === 'cancelado' ? 'Pedido cancelado' : 'Nuevo pedido',
        usuario: o.usuario?.nombre || 'Desconocido',
        haceMinutos: Math.max(1, tiempo),
        fecha: o.createdAt
      });
    });

    usuariosRecientes.forEach((u) => {
      const tiempo = Math.floor((Date.now() - new Date(u.createdAt)) / 60000);
      actividad.push({
        tipo: 'registro',
        accion: 'registro',
        texto: `${u.nombre}`,
        detalle: 'Nuevo registro de cliente',
        usuario: u.nombre,
        haceMinutos: Math.max(1, tiempo),
        fecha: u.createdAt
      });
    });

    actividad.sort((a, b) => b.fecha - a.fecha);
    actividad.splice(15);

    res.json(actividad);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
