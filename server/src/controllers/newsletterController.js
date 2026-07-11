import Subscriber from '../models/Subscriber.js';

export const suscribir = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ mensaje: 'El email es obligatorio' });
    }

    const existe = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existe) {
      if (!existe.activo) {
        existe.activo = true;
        await existe.save();
        return res.json({ mensaje: 'Suscripción reactivada' });
      }
      return res.status(400).json({ mensaje: 'El email ya está suscrito' });
    }

    await Subscriber.create({ email: email.toLowerCase() });
    res.status(201).json({ mensaje: 'Suscripción exitosa' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const listarSuscriptores = async (req, res) => {
  try {
    const suscriptores = await Subscriber.find({ activo: true }).sort({ createdAt: -1 });
    res.json(suscriptores);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
