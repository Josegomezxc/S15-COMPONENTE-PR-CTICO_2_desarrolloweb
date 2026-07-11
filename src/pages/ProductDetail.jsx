import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCarrito } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';

export default function ProductDetail() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { agregarAlCarrito } = useCarrito();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await api.get(`/productos/${id}`);
        setProducto(res.data);
      } catch {
        setError(t('detail.notFound'));
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleAgregar = async () => {
    if (!usuario) { navigate('/login'); return; }
    try {
      await agregarAlCarrito(id, cantidad);
      setMsg(t('detail.added'));
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setError(t('detail.error'));
    }
  };

  const renderStars = (r) => {
    const full = Math.floor(r || 4);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`material-symbols-outlined ${i < full ? 'fill' : ''}`} style={{fontSize:18}}>star</span>
    ));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-page"><h2>{error}</h2><Link to="/productos" className="btn btn-primary">{t('detail.back')}</Link></div>;

  return (
    <div className="product-detail">
      <Link to="/productos" className="back-link">
        <span className="material-symbols-outlined">arrow_back</span> {t('detail.back')}
      </Link>
      <div className="product-detail-content">
        <div className="product-detail-image">
          <div className="product-detail-badge">{producto.stock > 10 ? t('detail.inStock') : producto.stock > 0 ? t('detail.limited') : t('detail.outOfStock')}</div>
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} />
          ) : (
            <span className="material-symbols-outlined" style={{fontSize: 80, color: 'var(--on-surface-variant)'}}>image</span>
          )}
        </div>
        <div className="product-detail-info">
          <p className="product-detail-categoria">{producto.categoria?.nombre || 'General'}</p>
          <h1>{producto.nombre}</h1>
          <div className="stars">{renderStars(4.5)} <span style={{fontSize:14, color:'var(--on-surface-variant)'}}>(4.5)</span></div>
          <p className="product-detail-precio">${producto.precio.toFixed(2)}</p>
          <p className="product-detail-descripcion">{producto.descripcion}</p>
          <p className="product-detail-stock"><strong>{t('detail.stock')}</strong> {producto.stock} {t('detail.units')}</p>

          <Message tipo="success" mensaje={msg} />
          <Message tipo="error" mensaje={error} />

          {producto.stock > 0 && (
            <div className="product-detail-actions">
              <div className="qty-selector">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="btn-qty">
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span>{cantidad}</span>
                <button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} className="btn-qty">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <button onClick={handleAgregar} className="btn btn-primary btn-lg">
                <span className="material-symbols-outlined" style={{fontSize:20}}>shopping_cart</span>
                {t('detail.addToCart')}
              </button>
            </div>
          )}
          {producto.stock === 0 && <p className="product-detail-sin-stock">{t('detail.outOfStock')}</p>}
        </div>
      </div>
    </div>
  );
}
