import Mensaje from '../models/Mensaje.js';

export const enviarMensaje = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    const nuevo = await Mensaje.create({ nombre, email, mensaje });
    res.status(201).json({ mensaje: 'Mensaje enviado correctamente. Te contactaremos pronto.', data: nuevo });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const listarMensajes = async (req, res) => {
  try {
    const { page = 1, limit = 10, filtro } = req.query;
    const query = {};
    if (filtro === 'pendiente') query.respondido = false;
    if (filtro === 'respondido') query.respondido = true;

    const total = await Mensaje.countDocuments(query);
    const mensajes = await Mensaje.find(query)
      .populate('respondidoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ data: mensajes, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const obtenerMensaje = async (req, res) => {
  try {
    const mensaje = await Mensaje.findById(req.params.id).populate('respondidoPor', 'nombre email');
    if (!mensaje) {
      return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
    }
    res.json(mensaje);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const misMensajes = async (req, res) => {
  try {
    const mensajes = await Mensaje.find({ email: req.usuario.email })
      .populate('respondidoPor', 'nombre')
      .sort({ createdAt: -1 });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const misMensajesCount = async (req, res) => {
  try {
    const count = await Mensaje.countDocuments({ email: req.usuario.email, respondido: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const mensajesPendientesCount = async (req, res) => {
  try {
    const count = await Mensaje.countDocuments({ respondido: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const responderMensaje = async (req, res) => {
  try {
    const { respuesta } = req.body;
    if (!respuesta) {
      return res.status(400).json({ mensaje: 'La respuesta es obligatoria' });
    }
    const mensaje = await Mensaje.findByIdAndUpdate(
      req.params.id,
      {
        respondido: true,
        respuesta,
        respondidoPor: req.usuario._id,
        respondidoAt: new Date()
      },
      { new: true }
    ).populate('respondidoPor', 'nombre email');
    if (!mensaje) {
      return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
    }
    res.json({ mensaje: 'Respuesta enviada correctamente', data: mensaje });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
