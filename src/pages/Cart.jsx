import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Cart() {
  const { carrito, loading, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;

  const total = carrito.items?.reduce(
    (sum, item) => sum + (item.producto?.precio || 0) * item.cantidad, 0
  ) || 0;

  const handleCantidadChange = (item, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    if (nuevaCantidad > (item.producto?.stock || 0)) return;
    actualizarCantidad(item.producto._id, nuevaCantidad);
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Carrito de Compras</h1>
        {carrito.items?.length > 0 && (
          <button onClick={vaciarCarrito} className="btn btn-delete">
            Vaciar Carrito
          </button>
        )}
      </div>

      {!carrito.items || carrito.items.length === 0 ? (
        <div className="empty-cart">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde nuestro catálogo</p>
          <Link to="/productos" className="btn btn-primary">Ver Productos</Link>
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
                    <div className="cart-item-placeholder">Sin imagen</div>
                  )}
                </div>
                <div className="cart-item-info">
                  <h3>{item.producto?.nombre || 'Producto'}</h3>
                  <p className="cart-item-precio">
                    ${(item.producto?.precio || 0).toFixed(2)}
                  </p>
                </div>
                <div className="cart-item-cantidad">
                  <button
                    onClick={() => handleCantidadChange(item, item.cantidad - 1)}
                    className="btn-qty"
                  >-</button>
                  <span>{item.cantidad}</span>
                  <button
                    onClick={() => handleCantidadChange(item, item.cantidad + 1)}
                    className="btn-qty"
                  >+</button>
                </div>
                <div className="cart-item-subtotal">
                  ${((item.producto?.precio || 0) * item.cantidad).toFixed(2)}
                </div>
                <button
                  onClick={() => eliminarDelCarrito(item.producto._id)}
                  className="btn btn-delete btn-sm"
                >Eliminar</button>
              </div>
            ))}
          </div>

          <div className="cart-resumen">
            <div className="cart-total">
              <span>Total:</span>
              <span className="cart-total-monto">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg btn-block"
            >
              Proceder al Pago
            </button>
          </div>
        </>
      )}
    </div>
  );
}
