import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const iconMap = {
  'Computadoras': 'laptop_mac',
  'Accesorios': 'mouse',
  'Monitores': 'monitor',
  'default': 'dashboard',
  'Muebles': 'chair_alt',
  'Teclados': 'keyboard',
};

export default function ProductList() {
  const { t } = useLanguage();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const catParam = searchParams.get('categoria') || '';
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(5000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { q: searchQuery || undefined, limit: 50 };
        if (catParam) params.categoria = catParam;
        const [prodRes, catRes] = await Promise.all([
          api.get('/productos', { params }),
          api.get('/categorias')
        ]);
        setProductos(prodRes.data.data || prodRes.data);
        setCategorias(catRes.data);
        if (catParam) setCategoriaSeleccionada(catParam);
      } catch (err) {
        setError(t('adminProducts.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, catParam, t]);

  const handleFiltrar = async (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    setLoading(true);
    try {
      const params = {};
      if (categoriaId) params.categoria = categoriaId;
      if (precioMin > 0) params.precioMin = precioMin;
      if (precioMax < 5000) params.precioMax = precioMax;
      if (sortBy === 'price_asc') params.sort = 'precio';
      else if (sortBy === 'price_desc') params.sort = '-precio';
      else if (sortBy === 'name') params.sort = 'nombre';
      const res = await api.get('/productos', { params });
      setProductos(res.data.data || res.data);
    } catch (err) {
      setError(t('adminProducts.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (val) => {
    setSortBy(val);
    handleFiltrar(categoriaSeleccionada);
  };

  const handlePriceChange = () => {
    handleFiltrar(categoriaSeleccionada);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="product-layout">
      <aside className="product-sidebar">
        <div className="sidebar-section">
          <h4>{t('products.categories')}</h4>
          <div className="category-list">
            <button
              className={`category-btn ${!categoriaSeleccionada ? 'active' : ''}`}
              onClick={() => handleFiltrar('')}
            >
              <span className="material-symbols-outlined">all_inclusive</span>
              {t('products.all')}
            </button>
            {categorias.map((cat) => (
              <button
                key={cat._id}
                className={`category-btn ${categoriaSeleccionada === cat._id ? 'active' : ''}`}
                onClick={() => handleFiltrar(cat._id)}
              >
                <span className="material-symbols-outlined">{iconMap[cat.nombre] || iconMap.default}</span>
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
        <div className="sidebar-section">
          <h4>{t('products.priceRange')}</h4>
          <div className="price-range">
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, color: 'var(--outline)' }}>Mín: ${precioMin}</label>
              <input type="range" min="0" max="5000" step="100" value={precioMin}
                onChange={(e) => setPrecioMin(Number(e.target.value))}
                onMouseUp={handlePriceChange} onTouchEnd={handlePriceChange}
                className="range-input" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--outline)' }}>Máx: ${precioMax}</label>
              <input type="range" min="0" max="5000" step="100" value={precioMax}
                onChange={(e) => setPrecioMax(Number(e.target.value))}
                onMouseUp={handlePriceChange} onTouchEnd={handlePriceChange}
                className="range-input" />
            </div>
            <div className="price-labels">
              <span>$0</span>
              <span>$5,000</span>
            </div>
          </div>
        </div>
      </aside>
      <main className="product-main">
        <div className="product-toolbar">
          <p className="product-count">{searchQuery ? t('products.foundFor', { n: productos.length, q: searchQuery }) : t('products.found', { n: productos.length })}</p>
          <div className="sort-group">
            <label>{t('products.sortBy')}</label>
            <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
              <option value="">{t('products.featured')}</option>
              <option value="price_asc">{t('products.lowToHigh')}</option>
              <option value="price_desc">{t('products.highToLow')}</option>
              <option value="name">{t('products.name')}</option>
            </select>
          </div>
        </div>
        {error && <div className="message message-error">{error}</div>}
        {productos.length === 0 ? (
          <p className="empty-message" style={{ textAlign: 'center', padding: 48 }}>
            {t('products.empty')}
          </p>
        ) : (
          <div className="product-grid">
            {productos.map((producto) => (
              <ProductCard key={producto._id} producto={producto} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
