import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/productos'),
          api.get('/categorias')
        ]);
        setProductos(prodRes.data);
        setCategorias(catRes.data);
      } catch (err) {
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFiltrar = async (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    setLoading(true);
    try {
      const params = categoriaId ? { categoria: categoriaId } : {};
      const res = await api.get('/productos', { params });
      setProductos(res.data);
    } catch (err) {
      setError('Error al filtrar productos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="product-list">
      <h1>Productos</h1>

      {error && <div className="message message-error">{error}</div>}

      <div className="filtros">
        <button
          className={`btn btn-filter ${!categoriaSeleccionada ? 'active' : ''}`}
          onClick={() => handleFiltrar('')}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat._id}
            className={`btn btn-filter ${categoriaSeleccionada === cat._id ? 'active' : ''}`}
            onClick={() => handleFiltrar(cat._id)}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {productos.length === 0 ? (
        <p className="empty-message">No hay productos disponibles</p>
      ) : (
        <div className="product-grid">
          {productos.map((producto) => (
            <ProductCard key={producto._id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
