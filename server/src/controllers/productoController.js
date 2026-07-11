import Producto from '../models/Producto.js';

export const obtenerProductos = async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = { activo: true };

    if (categoria) {
      filtro.categoria = categoria;
    }

    const productos = await Producto.find(filtro).populate('categoria', 'nombre');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('categoria', 'nombre');

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, stock, imagen } = req.body;

    const producto = await Producto.create({
      nombre, descripcion, precio, categoria, stock, imagen
    });

    const productoConPopulate = await Producto.findById(producto._id).populate('categoria', 'nombre');
    res.status(201).json(productoConPopulate);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categoria', 'nombre');

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
