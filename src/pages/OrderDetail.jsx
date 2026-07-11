import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

export default function OrderDetail() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { t } = useLanguage();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/ordenes/${id}`).then(r => setOrden(r.data)).catch(() => setError(t('detailOrder.notFound'))).finally(() => setLoading(false));
  }, [id]);

  const handleCambiarEstado = async (nuevoEstado) => {
    try {
      const res = await api.put(`/ordenes/${id}/estado`, { estado: nuevoEstado });
      setOrden(res.data);
    } catch { setError(t('detailOrder.statusError')); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-page"><h2>{error}</h2><Link to="/ordenes" className="btn btn-primary">{t('detailOrder.back')}</Link></div>;

  const esAdmin = usuario?.rol === 'admin';

  return (
    <div className="order-detail-page">
      <Link to="/ordenes" className="back-link">
        <span className="material-symbols-outlined">arrow_back</span> {t('detailOrder.back')}
      </Link>

      <div className="order-detail-card">
        <div className="order-detail-header">
          <h1>{t('detailOrder.order', { id: orden._id.slice(-8).toUpperCase() })}</h1>
          <span className={`order-status order-status-${orden.estado}`}>
            {t('orders.' + orden.estado) || orden.estado}
          </span>
        </div>

        <div className="order-detail-meta">
          <p><span className="material-symbols-outlined">calendar_month</span> {new Date(orden.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          {orden.direccionEnvio && <p><span className="material-symbols-outlined">location_on</span> {orden.direccionEnvio}</p>}
        </div>

        <div className="order-detail-items">
          <h2>{t('detailOrder.products')}</h2>
          <table className="styled-table">
            <thead><tr><th>{t('detailOrder.product')}</th><th>{t('detailOrder.price')}</th><th>{t('detailOrder.qty')}</th><th>{t('detailOrder.subtotal')}</th></tr></thead>
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
          <h3>{t('detailOrder.total')} ${orden.total.toFixed(2)}</h3>
        </div>

        {esAdmin && (
          <div className="order-detail-admin">
            <h3>{t('detailOrder.updateStatus')}</h3>
            <div className="status-actions">
              {['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'].map((est) => (
                <button key={est} onClick={() => handleCambiarEstado(est)}
                  className={`btn ${orden.estado === est ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  disabled={orden.estado === est}>
                  {t('orders.' + est) || est}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
