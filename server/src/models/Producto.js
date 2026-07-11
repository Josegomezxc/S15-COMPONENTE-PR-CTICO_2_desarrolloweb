import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  imagen: {
    type: String,
    default: ''
  },
  activo: {
    type: Boolean,
    default: true
  },
  enOferta: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Producto', productoSchema);
