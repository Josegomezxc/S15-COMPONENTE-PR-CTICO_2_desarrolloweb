import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCarrito } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { cantidadItems } = useCarrito();
  const { t, lang, changeLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) navigate(`/productos?q=${encodeURIComponent(q)}`);
  }, [searchTerm, navigate]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link to="/" className="navbar-brand">ProStore</Link>
            <div className="hidden-md" style={{ display: 'none', gap: 16, alignItems: 'center' }}>
              <Link to="/productos" className={`nav-link ${isActive('/productos')}`}>{t('nav.shop')}</Link>
              <Link to="/categorias" className={`nav-link ${isActive('/categorias')}`}>{t('nav.categories')}</Link>
              <Link to="/ofertas" className={`nav-link ${isActive('/ofertas')}`}>{t('nav.deals')}</Link>
              <Link to="/contacto" className={`nav-link ${isActive('/contacto')}`}>{t('nav.support')}</Link>
            </div>
        </div>

        <form className="nav-search" onSubmit={handleSearch}>
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text" placeholder={t('nav.search')}
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="navbar-links">
          <button onClick={() => setDarkMode(!darkMode)} className="dark-toggle" title={darkMode ? t('nav.lightMode') : t('nav.darkMode')}>
            <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={() => changeLang(lang === 'es' ? 'en' : 'es')} className="dark-toggle" title={lang === 'es' ? t('nav.english') : t('nav.spanish')}>
            <span className="material-symbols-outlined">translate</span>
          </button>
          {usuario ? (
            <>
              <Link to="/carrito" className={`nav-link nav-cart ${isActive('/carrito')}`}>
                <span className="material-symbols-outlined">shopping_cart</span>
                {cantidadItems > 0 && (
                  <span className="cart-badge">{cantidadItems}</span>
                )}
              </Link>
              <Link to="/ordenes" className={`nav-link ${isActive('/ordenes')}`}>
                <span className="material-symbols-outlined">receipt_long</span>
              </Link>
              {usuario.rol === 'admin' && (
                <Link to="/admin/productos" className={`nav-link ${isActive('/admin/productos')}`}>
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                </Link>
              )}
              <Link to="/perfil" className={`nav-link nav-user ${isActive('/perfil')}`}>
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
              <button onClick={handleLogout} className="nav-link nav-btn">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
              <Link to="/register" className={`nav-link ${isActive('/register')}`}>{t('nav.register')}</Link>
            </>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .hidden-md { display: flex !important; }
        }
        .nav-link { display: flex; align-items: center; gap: 4px; }
      `}</style>
    </nav>
  );
}
