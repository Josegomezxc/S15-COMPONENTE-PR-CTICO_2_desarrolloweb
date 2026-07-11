import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';

const estados = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado'
};

export default function Orders() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await api.get('/ordenes');
        setOrdenes(res.data);
      } catch {
        setError('Error al cargar órdenes');
      } finally {
        setLoading(false);
      }
    };
    fetchOrdenes();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="orders-page">
      <h1>Mis Órdenes</h1>

      {location.state?.success && (
        <Message tipo="success" mensaje={location.state.success} />
      )}

      {error && <Message tipo="error" mensaje={error} />}

      {ordenes.length === 0 ? (
        <div className="empty-orders">
          <h2>No tienes órdenes aún</h2>
          <Link to="/productos" className="btn btn-primary">Ver Productos</Link>
        </div>
      ) : (
        <div className="orders-list">
          {ordenes.map((orden) => (
            <div key={orden._id} className="order-card">
              <div className="order-header">
                <span className="order-id">#{orden._id.slice(-8)}</span>
                <span className={`order-estado order-estado-${orden.estado}`}>
                  {estados[orden.estado] || orden.estado}
                </span>
              </div>
              <div className="order-body">
                <p className="order-fecha">
                  {new Date(orden.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <p className="order-items-count">
                  {orden.items.length} producto(s)
                </p>
                <p className="order-total">
                  Total: <strong>${orden.total.toFixed(2)}</strong>
                </p>
              </div>
              <Link to={`/ordenes/${orden._id}`} className="btn btn-secondary">
                Ver detalle
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
