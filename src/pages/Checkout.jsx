import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import Message from '../components/Message';

export default function Checkout() {
  const { t } = useLanguage();
  const { carrito, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const total = carrito.items?.reduce(
    (sum, item) => sum + (item.producto?.precio || 0) * item.cantidad, 0
  ) || 0;

  if (!carrito.items || carrito.items.length === 0) {
    return (
      <div className="empty-cart">
        <span className="material-symbols-outlined empty-icon">shopping_cart</span>
        <h2>{t('checkout.empty')}</h2>
        <button onClick={() => navigate('/productos')} className="btn btn-primary">{t('checkout.browse')}</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!direccion.trim()) { setError(t('checkout.addressRequired')); return; }
    try {
      setLoading(true);
      await api.post('/ordenes', { direccionEnvio: direccion });
      await vaciarCarrito();
      navigate('/ordenes', { state: { success: t('checkout.orderCreated') } });
    } catch (err) {
      setError(err.response?.data?.mensaje || t('detailOrder.statusError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>{t('checkout.title')}</h1>
      <div className="checkout-grid">
        <div className="checkout-summary">
          <h2>{t('checkout.summary')}</h2>
          {carrito.items.map((item) => (
            <div key={item.producto?._id} className="checkout-item">
              <span>{item.producto?.nombre} x{item.cantidad}</span>
              <span>${((item.producto?.precio || 0) * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-total">
            <strong>{t('checkout.total')}</strong>
            <strong className="checkout-total-amount">${total.toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form-card">
          <h2>{t('checkout.shipping')}</h2>
          <Message tipo="error" mensaje={error} />
          <div className="form-group">
            <label>{t('checkout.address')}</label>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">location_on</span>
              <textarea
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder={t('checkout.addressPlaceholder')}
                rows="3"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? t('checkout.processing') : t('checkout.placeOrder', { total: total.toFixed(2) })}
          </button>
        </form>
      </div>
    </div>
  );
}
