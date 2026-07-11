import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Cart() {
  const { t } = useLanguage();
  const { carrito, loading, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;

  const total = carrito.items?.reduce(
    (sum, item) => sum + (item.producto?.precio || 0) * item.cantidad, 0
  ) || 0;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>{t('cart.title')}</h1>
        {carrito.items?.length > 0 && (
          <button onClick={vaciarCarrito} className="btn btn-delete">
            <span className="material-symbols-outlined" style={{fontSize:18}}>delete_sweep</span>
            {t('cart.clear')}
          </button>
        )}
      </div>

      {!carrito.items || carrito.items.length === 0 ? (
        <div className="empty-cart">
          <span className="material-symbols-outlined empty-icon">shopping_cart</span>
          <h2>{t('cart.empty')}</h2>
          <p>{t('cart.emptyDesc')}</p>
          <Link to="/productos" className="btn btn-primary">{t('cart.browse')}</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {carrito.items.map((item) => (
              <div key={item.producto?._id || Math.random()} className="cart-item">
                <div className="cart-item-image">
                  {item.producto?.imagen ? (
                    <img src={item.producto.imagen} alt={item.producto.nombre} />
                  ) : (
                    <span className="material-symbols-outlined" style={{fontSize:32, color:'var(--on-surface-variant)'}}>image</span>
                  )}
                </div>
                <div className="cart-item-info">
                  <h3>{item.producto?.nombre || 'Producto'}</h3>
                  <p className="cart-item-precio">${(item.producto?.precio || 0).toFixed(2)}</p>
                </div>
                <div className="qty-selector">
                  <button onClick={() => actualizarCantidad(item.producto._id, Math.max(1, item.cantidad - 1))} className="btn-qty">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => actualizarCantidad(item.producto._id, Math.min(item.producto?.stock || 99, item.cantidad + 1))} className="btn-qty">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <div className="cart-item-subtotal">
                  ${((item.producto?.precio || 0) * item.cantidad).toFixed(2)}
                </div>
                <button onClick={() => eliminarDelCarrito(item.producto._id)} className="btn btn-icon btn-delete">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>{t('cart.estimatedTotal')}</span>
              <span className="cart-total-amount">${total.toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-lg btn-block">
              {t('cart.checkout')}
              <span className="material-symbols-outlined" style={{fontSize:18}}>arrow_forward</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
