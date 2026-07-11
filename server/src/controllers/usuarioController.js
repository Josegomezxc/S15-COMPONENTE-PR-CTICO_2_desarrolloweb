import Usuario from '../models/Usuario.js';

export const obtenerPerfil = async (req, res) => {
  res.json(req.usuario);
};

export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, email } = req.body;

    const usuario = await Usuario.findById(req.usuario._id);

    if (email && email !== usuario.email) {
      const existe = await Usuario.findOne({ email });
      if (existe) {
        return res.status(400).json({ mensaje: 'El email ya está registrado' });
      }
      usuario.email = email;
    }

    if (nombre) usuario.nombre = nombre;

    const actualizado = await usuario.save();
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;

    const usuario = await Usuario.findById(req.usuario._id);

    const esCorrecta = await usuario.compararPassword(passwordActual);
    if (!esCorrecta) {
      return res.status(400).json({ mensaje: 'Contraseña actual incorrecta' });
    }

    usuario.password = nuevaPassword;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
