import Carrito from '../models/Carrito.js';
import Producto from '../models/Producto.js';

export const obtenerCarrito = async (req, res) => {
  try {
    let carrito = await Carrito.findOne({ usuario: req.usuario._id })
      .populate('items.producto', 'nombre precio stock imagen');

    if (!carrito) {
      carrito = await Carrito.create({ usuario: req.usuario._id, items: [] });
    }

    res.json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const agregarAlCarrito = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;

    const producto = await Producto.findById(productoId);
    if (!producto || !producto.activo) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (producto.stock < cantidad) {
      return res.status(400).json({ mensaje: 'Stock insuficiente' });
    }

    let carrito = await Carrito.findOne({ usuario: req.usuario._id });
    if (!carrito) {
      carrito = new Carrito({ usuario: req.usuario._id, items: [] });
    }

    const itemExistente = carrito.items.find(
      (item) => item.producto.toString() === productoId
    );

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      carrito.items.push({ producto: productoId, cantidad });
    }

    await carrito.save();

    carrito = await Carrito.findOne({ usuario: req.usuario._id })
      .populate('items.producto', 'nombre precio stock imagen');

    res.json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const actualizarCantidad = async (req, res) => {
  try {
    const { productoId } = req.params;
    const { cantidad } = req.body;

    if (cantidad < 1) {
      return res.status(400).json({ mensaje: 'La cantidad debe ser al menos 1' });
    }

    const carrito = await Carrito.findOne({ usuario: req.usuario._id });
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    const item = carrito.items.find(
      (item) => item.producto.toString() === productoId
    );

    if (!item) {
      return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
    }

    const producto = await Producto.findById(productoId);
    if (producto && producto.stock < cantidad) {
      return res.status(400).json({ mensaje: 'Stock insuficiente' });
    }

    item.cantidad = cantidad;
    await carrito.save();

    const carritoActualizado = await Carrito.findOne({ usuario: req.usuario._id })
      .populate('items.producto', 'nombre precio stock imagen');

    res.json(carritoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const eliminarDelCarrito = async (req, res) => {
  try {
    const { productoId } = req.params;

    const carrito = await Carrito.findOne({ usuario: req.usuario._id });
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    carrito.items = carrito.items.filter(
      (item) => item.producto.toString() !== productoId
    );

    await carrito.save();

    const carritoActualizado = await Carrito.findOne({ usuario: req.usuario._id })
      .populate('items.producto', 'nombre precio stock imagen');

    res.json(carritoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const vaciarCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.usuario._id });
    if (carrito) {
      carrito.items = [];
      await carrito.save();
    }
    res.json({ mensaje: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
