import mongoose from 'mongoose';

const ordenSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  items: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto'
      },
      nombre: String,
      precio: Number,
      cantidad: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  direccionEnvio: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Orden', ordenSchema);
