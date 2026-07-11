import Orden from '../models/Orden.js';
import Producto from '../models/Producto.js';
import Usuario from '../models/Usuario.js';
import Categoria from '../models/Categoria.js';

export const obtenerStats = async (req, res) => {
  try {
    const totalProductos = await Producto.countDocuments({ activo: true });
    const totalOrdenes = await Orden.countDocuments();
    const totalUsuarios = await Usuario.countDocuments();
    const totalCategorias = await Categoria.countDocuments();

    const ordenes = await Orden.find();

    const ventasTotales = ordenes.reduce((sum, o) => sum + o.total, 0);

    const ventasPorMes = [];
    const ventasPorMesMap = {};

    ordenes.forEach((o) => {
      const mes = new Date(o.createdAt).toLocaleString('es-ES', {
        month: 'short',
        year: 'numeric'
      });
      ventasPorMesMap[mes] = (ventasPorMesMap[mes] || 0) + o.total;
    });

    Object.entries(ventasPorMesMap).forEach(([mes, total]) => {
      ventasPorMes.push({ mes, total });
    });

    const ordenesPorEstado = [
      { estado: 'pendiente', cantidad: ordenes.filter((o) => o.estado === 'pendiente').length },
      { estado: 'pagado', cantidad: ordenes.filter((o) => o.estado === 'pagado').length },
      { estado: 'enviado', cantidad: ordenes.filter((o) => o.estado === 'enviado').length },
      { estado: 'entregado', cantidad: ordenes.filter((o) => o.estado === 'entregado').length },
      { estado: 'cancelado', cantidad: ordenes.filter((o) => o.estado === 'cancelado').length }
    ];

    const productos = await Producto.find({ activo: true }).populate('categoria');
    const productosPorCategoriaMap = {};

    productos.forEach((p) => {
      const nombreCat = p.categoria?.nombre || 'Sin categoría';
      productosPorCategoriaMap[nombreCat] = (productosPorCategoriaMap[nombreCat] || 0) + 1;
    });

    const productosPorCategoria = Object.entries(productosPorCategoriaMap).map(([categoria, cantidad]) => ({
      categoria,
      cantidad
    }));

    res.json({
      totalProductos,
      totalOrdenes,
      totalUsuarios,
      totalCategorias,
      ventasTotales,
      ventasPorMes,
      ordenesPorEstado,
      productosPorCategoria
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
