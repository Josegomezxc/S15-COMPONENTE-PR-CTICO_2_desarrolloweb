import Orden from '../models/Orden.js';
import Carrito from '../models/Carrito.js';
import Producto from '../models/Producto.js';

export const crearOrden = async (req, res) => {
  try {
    const { direccionEnvio } = req.body;

    const carrito = await Carrito.findOne({ usuario: req.usuario._id })
      .populate('items.producto');

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }

    const itemsOrden = [];
    let total = 0;

    for (const item of carrito.items) {
      const producto = item.producto;

      if (!producto || !producto.activo) {
        return res.status(400).json({
          mensaje: `Producto "${producto?.nombre || 'desconocido'}" no disponible`
        });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para "${producto.nombre}"`
        });
      }

      itemsOrden.push({
        producto: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: item.cantidad
      });

      total += producto.precio * item.cantidad;
    }

    for (const item of carrito.items) {
      await Producto.findByIdAndUpdate(item.producto._id, {
        $inc: { stock: -item.cantidad }
      });
    }

    const orden = await Orden.create({
      usuario: req.usuario._id,
      items: itemsOrden,
      total,
      direccionEnvio: direccionEnvio || ''
    });

    carrito.items = [];
    await carrito.save();

    const ordenPopulada = await Orden.findById(orden._id)
      .populate('items.producto', 'nombre precio');

    res.status(201).json(ordenPopulada);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find({ usuario: req.usuario._id })
      .sort({ createdAt: -1 });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const obtenerOrden = async (req, res) => {
  try {
    const orden = await Orden.findOne({
      _id: req.params.id,
      usuario: req.usuario._id
    }).populate('items.producto', 'nombre precio imagen');

    if (!orden) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }

    res.json(orden);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const obtenerTodasOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find()
      .populate('usuario', 'nombre email')
      .sort({ createdAt: -1 });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const actualizarEstadoOrden = async (req, res) => {
  try {
    const { estado } = req.body;

    const orden = await Orden.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    if (!orden) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }

    res.json(orden);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
