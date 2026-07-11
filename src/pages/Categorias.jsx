import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const iconMap = {
  'Computadoras': 'laptop_mac',
  'Accesorios': 'mouse',
  'Monitores': 'monitor',
  'Muebles': 'chair_alt',
  'Teclados': 'keyboard',
  'Audio': 'headphones',
  'Periféricos': 'webcam',
};

export default function Categorias() {
  const { t } = useLanguage();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categorias')
      .then((res) => setCategorias(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="product-layout">
      <main className="product-main" style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 8 }}>{t('products.categories')}</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 32 }}>
          {t('categories.subtitle')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {categorias.map((cat, index) => (
            <Link
              key={cat._id}
              to={`/productos?categoria=${cat._id}`}
              className="category-card"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <div className="category-card-icon">
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                  {iconMap[cat.nombre] || 'category'}
                </span>
              </div>
              <h3>{cat.nombre}</h3>
              <p>{cat.descripcion}</p>
              <div className="btn-overlay">
                <span className="btn btn-secondary btn-sm" style={{ pointerEvents: 'none' }}>
                  {t('products.viewProducts')} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
