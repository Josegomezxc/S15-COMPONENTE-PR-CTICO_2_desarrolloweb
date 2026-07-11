import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const protegerRuta = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ mensaje: 'Token no válido' });
    }
  }

  if (!token) {
    return res.status(401).json({ mensaje: 'No autorizado, token requerido' });
  }
};

export const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ mensaje: 'Acceso denegado, se requiere rol de administrador' });
  }
};
