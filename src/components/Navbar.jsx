import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCarrito } from '../contexts/CartContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { cantidadItems } = useCarrito();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Tienda Virtual
        </Link>
        <div className="navbar-links">
          <Link to="/productos" className="nav-link">Productos</Link>
          {usuario ? (
            <>
              <Link to="/carrito" className="nav-link nav-cart">
                Carrito
                {cantidadItems > 0 && (
                  <span className="cart-badge">{cantidadItems}</span>
                )}
              </Link>
              <Link to="/ordenes" className="nav-link">Órdenes</Link>
              {usuario.rol === 'admin' && (
                <Link to="/admin/productos" className="nav-link">Admin</Link>
              )}
              <Link to="/perfil" className="nav-link nav-user">
                {usuario.nombre}
              </Link>
              <button onClick={handleLogout} className="nav-link nav-btn">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              <Link to="/register" className="nav-link">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
