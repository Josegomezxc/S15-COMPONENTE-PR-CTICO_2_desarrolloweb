import Producto from '../models/Producto.js';

export const obtenerProductos = async (req, res) => {
  try {
    const { categoria, sort, q, precioMin, precioMax, enOferta, page, limit } = req.query;
    const filtro = { activo: true };

    if (categoria) {
      filtro.categoria = categoria;
    }

    if (q) {
      filtro.nombre = { $regex: q, $options: 'i' };
    }

    if (precioMin || precioMax) {
      filtro.precio = {};
      if (precioMin) filtro.precio.$gte = Number(precioMin);
      if (precioMax) filtro.precio.$lte = Number(precioMax);
    }

    if (enOferta === 'true') {
      filtro.enOferta = true;
    }

    let orden = {};
    if (sort === 'precio') orden.precio = 1;
    else if (sort === '-precio') orden.precio = -1;
    else if (sort === 'nombre') orden.nombre = 1;
    else orden.createdAt = -1;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 100));
    const skip = (pageNum - 1) * limitNum;

    const [productos, total] = await Promise.all([
      Producto.find(filtro)
        .sort(orden)
        .skip(skip)
        .limit(limitNum)
        .populate('categoria', 'nombre'),
      Producto.countDocuments(filtro)
    ]);

    res.json({
      data: productos,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
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
