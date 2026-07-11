import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';

export default function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (err) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await api.delete(`/productos/${id}`);
      setSuccess('Producto eliminado correctamente');
      setProductos(productos.filter((p) => p._id !== id));
    } catch (err) {
      setError('Error al eliminar el producto');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Administrar Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">
          + Nuevo Producto
        </Link>
      </div>

      <Message tipo="error" mensaje={error} />
      <Message tipo="success" mensaje={success} />

      {productos.length === 0 ? (
        <p className="empty-message">No hay productos registrados</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p._id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria?.nombre || 'Sin categoría'}</td>
                  <td>${p.precio.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td className="actions">
                    <Link to={`/admin/productos/editar/${p._id}`} className="btn btn-edit">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleEliminar(p._id)}
                      className="btn btn-delete"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
