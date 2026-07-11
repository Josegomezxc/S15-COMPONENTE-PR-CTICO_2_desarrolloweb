import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { usuario } = useAuth();
  const [carrito, setCarrito] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const cantidadItems = carrito.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0;

  useEffect(() => {
    if (usuario) {
      fetchCarrito();
    } else {
      setCarrito({ items: [] });
    }
  }, [usuario]);

  const fetchCarrito = async () => {
    try {
      setLoading(true);
      const res = await api.get('/carrito');
      setCarrito(res.data);
    } catch {
      setCarrito({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const agregarAlCarrito = async (productoId, cantidad = 1) => {
    const res = await api.post('/carrito', { productoId, cantidad });
    setCarrito(res.data);
  };

  const actualizarCantidad = async (productoId, cantidad) => {
    const res = await api.put(`/carrito/${productoId}`, { cantidad });
    setCarrito(res.data);
  };

  const eliminarDelCarrito = async (productoId) => {
    const res = await api.delete(`/carrito/${productoId}`);
    setCarrito(res.data);
  };

  const vaciarCarrito = async () => {
    await api.delete('/carrito');
    setCarrito({ items: [] });
  };

  return (
    <CartContext.Provider value={{
      carrito, loading, cantidadItems,
      agregarAlCarrito, actualizarCantidad,
      eliminarDelCarrito, vaciarCarrito, fetchCarrito
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCarrito = () => useContext(CartContext);
