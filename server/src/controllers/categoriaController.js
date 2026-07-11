import Categoria from '../models/Categoria.js';

export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nombre: 1 });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const existe = await Categoria.findOne({ nombre });
    if (existe) {
      return res.status(400).json({ mensaje: 'La categoría ya existe' });
    }

    const categoria = await Categoria.create({ nombre, descripcion });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const actualizarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);

    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
