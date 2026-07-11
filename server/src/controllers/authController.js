import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Usuario from '../models/Usuario.js';
import PasswordReset from '../models/PasswordReset.js';

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const usuario = await Usuario.create({ nombre, email, password });
    const token = generarToken(usuario._id);

    res.status(201).json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      foto: usuario.foto,
      token
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const passwordCorrecta = await usuario.compararPassword(password);
    if (!passwordCorrecta) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario._id);

    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      foto: usuario.foto,
      token
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const perfil = async (req, res) => {
  res.json(req.usuario);
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ mensaje: 'El email es obligatorio' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'No existe una cuenta con ese email' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000);

    await PasswordReset.create({ usuario: usuario._id, token, expiresAt });

    res.json({ mensaje: 'Token de recuperación generado', token, email });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, nuevaPassword } = req.body;
    if (!token || !nuevaPassword) {
      return res.status(400).json({ mensaje: 'Token y nueva contraseña son obligatorios' });
    }

    const reset = await PasswordReset.findOne({ token, usado: false, expiresAt: { $gt: new Date() } });
    if (!reset) {
      return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }

    const usuario = await Usuario.findById(reset.usuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.password = nuevaPassword;
    await usuario.save();

    reset.usado = true;
    await reset.save();

    res.json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
