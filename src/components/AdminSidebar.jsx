import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-header-icon">
          <span className="material-symbols-outlined">shield_person</span>
        </div>
        <div className="admin-sidebar-header-text">
          <h3>{t('admin.panel')}</h3>
          <span>{t('admin.suite')}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={`sidebar-item ${isActive('/')}`}>
          <span className="material-symbols-outlined">dashboard</span> {t('admin.dashboard')}
        </Link>
        <Link to="/admin/productos" className={`sidebar-item ${isActive('/admin/productos') || isActive('/admin/productos/nuevo') || location.pathname.startsWith('/admin/productos/editar') ? 'active' : ''}`}>
          <span className="material-symbols-outlined">inventory_2</span> {t('admin.inventory')}
        </Link>
        <Link to="/ordenes" className={`sidebar-item ${isActive('/ordenes') || location.pathname.startsWith('/ordenes/') ? 'active' : ''}`}>
          <span className="material-symbols-outlined">receipt_long</span> {t('admin.orders')}
        </Link>
        <Link to="/admin/usuarios" className={`sidebar-item ${isActive('/admin/usuarios')}`}>
          <span className="material-symbols-outlined">group</span> {t('admin.customers')}
        </Link>
        <Link to="/perfil" className={`sidebar-item ${isActive('/perfil')}`}>
          <span className="material-symbols-outlined">settings</span> {t('admin.settings')}
        </Link>
      </nav>

      <Link to="/admin/productos/nuevo" className="sidebar-add-btn">
        <span className="material-symbols-outlined">add</span>
        {t('admin.addProduct')}
      </Link>

      <button onClick={handleLogout} className="sidebar-signout-btn">
        <span className="material-symbols-outlined">logout</span>
        {t('admin.signOut')}
      </button>
    </aside>
  );
}
