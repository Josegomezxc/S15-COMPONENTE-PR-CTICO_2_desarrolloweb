import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  mensaje: {
    type: String,
    required: true
  },
  respondido: {
    type: Boolean,
    default: false
  },
  respuesta: {
    type: String,
    default: ''
  },
  respondidoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  respondidoAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Mensaje', mensajeSchema);
