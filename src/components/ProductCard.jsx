import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProductCard({ producto }) {
  const { t } = useLanguage();
  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating || 4);
    const half = (rating || 4) - full > 0;
    for (let i = 0; i < 5; i++) {
      if (i < full) stars.push(<span key={i} className="material-symbols-outlined fill" style={{ fontSize: 16 }}>star</span>);
      else if (i === full && half) stars.push(<span key={i} className="material-symbols-outlined" style={{ fontSize: 16 }}>star_half</span>);
      else stars.push(<span key={i} className="material-symbols-outlined" style={{ fontSize: 16 }}>star</span>);
    }
    return stars;
  };

  const badgeText = producto.stock > 10 ? t('product.inStock') : producto.stock > 0 ? t('product.limitedStock') : t('product.outOfStock');
  const badgeClass = producto.stock > 10 ? 'stock' : producto.stock > 0 ? 'limited' : 'sale';

  return (
    <div className="product-card">
      <div className="product-card-image">
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} />
        ) : (
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--on-surface-variant)' }}>
            image
          </span>
        )}
        <div className={`product-card-badge ${badgeClass}`}>
          {badgeText}
        </div>
      </div>
      <div className="product-card-body">
        <p className="product-card-category">
          {producto.categoria?.nombre || 'General'}
        </p>
        <h3>{producto.nombre}</h3>
        <div className="product-card-footer">
          <span className="product-card-price">${producto.precio.toFixed(2)}</span>
          <div className="stars">{renderStars(4)}</div>
        </div>
        <Link to={`/productos/${producto._id}`} className="btn btn-primary btn-block btn-sm">
          {t('product.viewDetails')}
        </Link>
      </div>
    </div>
  );
}
