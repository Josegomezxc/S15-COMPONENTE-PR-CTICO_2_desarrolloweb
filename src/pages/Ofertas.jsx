import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Ofertas() {
  const { t } = useLanguage();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/productos', { params: { enOferta: 'true', limit: 50 } })
      .then((res) => setProductos(res.data.data || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="product-layout">
      <main className="product-main" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 8 }}>{t('nav.deals')}</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 32 }}>
          Productos seleccionados con precios especiales.
        </p>
        {productos.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 48, color: 'var(--on-surface-variant)' }}>
            No hay ofertas disponibles en este momento.
          </p>
        ) : (
          <div className="product-grid">
            {productos.map((p) => <ProductCard key={p._id} producto={p} />)}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/productos" className="btn btn-outline">{t('hero.explore')}</Link>
        </div>
      </main>
    </div>
  );
}
