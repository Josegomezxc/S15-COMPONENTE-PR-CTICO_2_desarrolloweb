import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../contexts/CartContext';
import api from '../services/api';
import Message from '../components/Message';

export default function Checkout() {
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
        <h2>No hay productos para pagar</h2>
        <button onClick={() => navigate('/productos')} className="btn btn-primary">
          Ir a productos
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!direccion.trim()) {
      setError('La dirección de envío es obligatoria');
      return;
    }

    try {
      setLoading(true);
      await api.post('/ordenes', { direccionEnvio: direccion });
      await vaciarCarrito();
      navigate('/ordenes', { state: { success: 'Orden creada exitosamente' } });
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al procesar la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Finalizar Compra</h1>

      <div className="checkout-content">
        <div className="checkout-resumen">
          <h2>Resumen de la orden</h2>
          {carrito.items.map((item) => (
            <div key={item.producto?._id} className="checkout-item">
              <span>{item.producto?.nombre} x{item.cantidad}</span>
              <span>${((item.producto?.precio || 0) * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-total">
            <strong>Total:</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Dirección de Envío</h2>
          <Message tipo="error" mensaje={error} />
          <div className="form-group">
            <label>Dirección *</label>
            <textarea
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, colonia, ciudad, código postal"
              rows="4"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? 'Procesando...' : 'Confirmar Compra - $' + total.toFixed(2)}
          </button>
        </form>
      </div>
    </div>
  );
}
