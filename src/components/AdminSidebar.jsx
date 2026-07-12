import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    api.get('/contacto/pendientes/count')
      .then(res => setPendientes(res.data.count || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const app = document.querySelector('.app');
    if (!app) return;
    app.classList.add('has-admin-sidebar');
    if (collapsed) {
      app.classList.add('sidebar-collapsed');
    } else {
      app.classList.remove('sidebar-collapsed');
    }
    return () => {
      app.classList.remove('has-admin-sidebar', 'sidebar-collapsed');
    };
  }, [collapsed]);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebarCollapsed', next);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="admin-sidebar">
      <button className="sidebar-toggle" onClick={handleToggle} title={collapsed ? t('admin.expand') : t('admin.collapse')}>
        <span className="material-symbols-outlined">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
      </button>

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
          <span className="material-symbols-outlined">dashboard</span> <span className="sidebar-label">{t('admin.dashboard')}</span>
        </Link>
        <Link to="/admin/productos" className={`sidebar-item ${isActive('/admin/productos') || isActive('/admin/productos/nuevo') || location.pathname.startsWith('/admin/productos/editar') ? 'active' : ''}`}>
          <span className="material-symbols-outlined">inventory_2</span> <span className="sidebar-label">{t('admin.inventory')}</span>
        </Link>
        <Link to="/ordenes" className={`sidebar-item ${isActive('/ordenes') || location.pathname.startsWith('/ordenes/') ? 'active' : ''}`}>
          <span className="material-symbols-outlined">receipt_long</span> <span className="sidebar-label">{t('admin.orders')}</span>
        </Link>
        <Link to="/admin/usuarios" className={`sidebar-item ${isActive('/admin/usuarios')}`}>
          <span className="material-symbols-outlined">group</span> <span className="sidebar-label">{t('admin.customers')}</span>
        </Link>
        <Link to="/admin/mensajes" className={`sidebar-item ${isActive('/admin/mensajes')}`} style={{ position: 'relative' }}>
          <span className="material-symbols-outlined">mail</span> <span className="sidebar-label">{t('admin.messages')}</span>
          {pendientes > 0 && (
            <span style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'var(--error)', color: 'var(--on-error)',
              fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
              borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px', lineHeight: 1
            }}>{pendientes > 99 ? '99+' : pendientes}</span>
          )}
        </Link>
        <Link to="/perfil" className={`sidebar-item ${isActive('/perfil')}`}>
          <span className="material-symbols-outlined">settings</span> <span className="sidebar-label">{t('admin.settings')}</span>
        </Link>
      </nav>

      <div style={{ flex: 1 }} />

      <Link to="/admin/productos/nuevo" className="sidebar-add-btn">
        <span className="material-symbols-outlined">add</span>
        <span className="sidebar-label">{t('admin.addProduct')}</span>
      </Link>

      <button onClick={handleLogout} className="sidebar-signout-btn">
        <span className="material-symbols-outlined">logout</span>
        <span className="sidebar-label">{t('admin.signOut')}</span>
      </button>
    </aside>
  );
}
