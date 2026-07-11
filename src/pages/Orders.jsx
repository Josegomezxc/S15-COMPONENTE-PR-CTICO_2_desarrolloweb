import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';

export default function Orders() {
  const { t } = useLanguage();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await api.get('/ordenes');
        setOrdenes(res.data);
      } catch { setError(t('detailOrder.statusError')); }
      finally { setLoading(false); }
    };
    fetchOrdenes();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="orders-page">
      <h1>{t('orders.title')}</h1>

      {location.state?.success && <Message tipo="success" mensaje={location.state.success} />}
      {error && <Message tipo="error" mensaje={error} />}

      {ordenes.length === 0 ? (
        <div className="empty-orders">
          <span className="material-symbols-outlined empty-icon">receipt_long</span>
          <h2>{t('orders.empty')}</h2>
          <Link to="/productos" className="btn btn-primary">{t('orders.shop')}</Link>
        </div>
      ) : (
        <div className="orders-list">
          {ordenes.map((orden) => (
            <div key={orden._id} className="order-card">
              <div className="order-header">
                <span className="order-id">#{orden._id.slice(-8).toUpperCase()}</span>
                <span className={`order-status order-status-${orden.estado}`}>
                  {t('orders.' + orden.estado) || orden.estado}
                </span>
              </div>
              <div className="order-body">
                <p className="order-date">{new Date(orden.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="order-items-count">{t('orders.productCount', { n: orden.items.length })}</p>
                <p className="order-total">{t('orders.total')} <strong>${orden.total.toFixed(2)}</strong></p>
              </div>
              <Link to={`/ordenes/${orden._id}`} className="btn btn-secondary btn-sm">
                {t('orders.viewDetails')}
                <span className="material-symbols-outlined" style={{fontSize:16}}>arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
