import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCarrito } from '../contexts/CartContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';

export default function ProductDetail() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { agregarAlCarrito } = useCarrito();
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
        setError('Producto no encontrado');
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const handleAgregar = async () => {
    if (!usuario) {
      navigate('/login');
      return;
    }
    try {
      await agregarAlCarrito(id, cantidad);
      setMsg('Producto agregado al carrito');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setError('Error al agregar al carrito');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="error-page">
        <h2>{error}</h2>
        <Link to="/productos" className="btn btn-primary">Volver a productos</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <Link to="/productos" className="btn btn-secondary">&larr; Volver</Link>
      <div className="product-detail-content">
        <div className="product-detail-image">
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} />
          ) : (
            <div className="product-detail-placeholder">Sin imagen</div>
          )}
        </div>
        <div className="product-detail-info">
          <h1>{producto.nombre}</h1>
          <p className="product-detail-categoria">
            {producto.categoria?.nombre || 'Sin categoría'}
          </p>
          <p className="product-detail-precio">${producto.precio.toFixed(2)}</p>
          <p className="product-detail-descripcion">{producto.descripcion}</p>
          <p className="product-detail-stock">
            <strong>Stock disponible:</strong> {producto.stock} unidades
          </p>

          <Message tipo="success" mensaje={msg} />
          <Message tipo="error" mensaje={error} />

          {producto.stock > 0 && (
            <div className="product-detail-actions">
              <div className="cart-item-cantidad">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="btn-qty"
                >-</button>
                <span>{cantidad}</span>
                <button
                  onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                  className="btn-qty"
                >+</button>
              </div>
              <button onClick={handleAgregar} className="btn btn-primary btn-lg">
                Agregar al Carrito
              </button>
            </div>
          )}

          {producto.stock === 0 && (
            <p className="product-detail-sin-stock">Producto agotado</p>
          )}

          <p className="product-detail-fecha">
            <small>Agregado el {new Date(producto.createdAt).toLocaleDateString()}</small>
          </p>
        </div>
      </div>
    </div>
  );
}
