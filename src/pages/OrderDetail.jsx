import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const estados = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado'
};

export default function OrderDetail() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrden = async () => {
      try {
        const res = await api.get(`/ordenes/${id}`);
        setOrden(res.data);
      } catch {
        setError('Orden no encontrada');
      } finally {
        setLoading(false);
      }
    };
    fetchOrden();
  }, [id]);

  const handleCambiarEstado = async (nuevoEstado) => {
    try {
      const res = await api.put(`/ordenes/${id}/estado`, { estado: nuevoEstado });
      setOrden(res.data);
    } catch {
      setError('Error al actualizar estado');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="error-page">
        <h2>{error}</h2>
        <Link to="/ordenes" className="btn btn-primary">Volver a órdenes</Link>
      </div>
    );
  }

  const esAdmin = usuario?.rol === 'admin';

  return (
    <div className="order-detail-page">
      <Link to="/ordenes" className="btn btn-secondary">&larr; Volver a órdenes</Link>

      <div className="order-detail-card">
        <div className="order-detail-header">
          <h1>Orden #{orden._id.slice(-8)}</h1>
          <span className={`order-estado order-estado-${orden.estado}`}>
            {estados[orden.estado] || orden.estado}
          </span>
        </div>

        <div className="order-detail-fecha">
          <strong>Fecha:</strong> {new Date(orden.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </div>

        {orden.direccionEnvio && (
          <div className="order-detail-direccion">
            <strong>Dirección de envío:</strong> {orden.direccionEnvio}
          </div>
        )}

        <div className="order-detail-items">
          <h2>Productos</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.nombre}</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>{item.cantidad}</td>
                  <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-detail-total">
          <h3>Total: ${orden.total.toFixed(2)}</h3>
        </div>

        {esAdmin && (
          <div className="order-detail-admin">
            <h3>Actualizar Estado</h3>
            <div className="admin-actions">
              {['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'].map((est) => (
                <button
                  key={est}
                  onClick={() => handleCambiarEstado(est)}
                  className={`btn ${orden.estado === est ? 'btn-primary' : 'btn-secondary'}`}
                  disabled={orden.estado === est}
                >
                  {estados[est]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
