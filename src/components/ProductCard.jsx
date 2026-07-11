import { Link } from 'react-router-dom';

export default function ProductCard({ producto }) {
  return (
    <div className="product-card">
      <div className="product-card-image">
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} />
        ) : (
          <div className="product-card-placeholder">Sin imagen</div>
        )}
      </div>
      <div className="product-card-body">
        <h3>{producto.nombre}</h3>
        <p className="product-card-categoria">
          {producto.categoria?.nombre || 'Sin categoría'}
        </p>
        <p className="product-card-precio">${producto.precio.toFixed(2)}</p>
        <p className="product-card-stock">
          Stock: {producto.stock}
        </p>
        <Link to={`/productos/${producto._id}`} className="btn btn-primary">
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
