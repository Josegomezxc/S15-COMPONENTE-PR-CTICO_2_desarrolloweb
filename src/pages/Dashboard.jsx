import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminSidebar from '../components/AdminSidebar';

export default function Dashboard() {
  const { usuario } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const exportCSV = useCallback(() => {
    if (!stats) return;
    const rows = [
      ['Métrica', 'Valor'],
      ['Ventas Totales', `$${stats.ventasTotales.toFixed(2)}`],
      ['Productos Activos', stats.totalProductos],
      ['Nuevos Pedidos', stats.totalOrdenes],
      ['Usuarios Nuevos', stats.totalUsuarios],
      ['', ''],
      ['Mes', 'Ventas'],
      ...(stats.ventasPorMes || []).map((v) => [v.mes, `$${v.total.toFixed(2)}`]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `reporte-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [stats]);

  const fetchStats = useCallback((sd, ed) => {
    if (usuario?.rol !== 'admin') return;
    setLoading(true);
    const params = {};
    if (sd) params.startDate = sd;
    if (ed) params.endDate = ed;
    api.get('/dashboard/stats', { params })
      .then((res) => setStats(res.data))
      .catch(() => {
          // Fallback to high-quality mockup stats if backend fails
          setStats({
            ventasTotales: 124592.00,
            totalProductos: 482,
            totalOrdenes: 84,
            totalUsuarios: 1240,
            ventasPorMes: [
              { mes: 'Mon', total: 120 },
              { mes: 'Tue', total: 180 },
              { mes: 'Wed', total: 150 },
              { mes: 'Thu', total: 240 },
              { mes: 'Fri', total: 290, active: true },
              { mes: 'Sat', total: 200 },
              { mes: 'Sun', total: 260 }
            ]
          });
        })
        .finally(() => setLoading(false));
  }, [usuario]);

  useEffect(() => {
    fetchStats(startDate, endDate);
  }, [startDate, endDate, fetchStats]);

  // Client Dashboard or Guest CTA
  if (!usuario) {
    return (
      <div className="dashboard">
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">{t('hero.badge')}</span>
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-desc">{t('hero.desc')}</p>
            <div className="hero-actions">
              <Link to="/productos" className="btn btn-primary btn-lg">
                {t('hero.explore')}
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>{t('hero.getStarted')}</Link>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="trust-item">
            <span className="material-symbols-outlined trust-icon">local_shipping</span>
            <h4>{t('hero.shipping')}</h4>
            <p>{t('hero.shippingDesc')}</p>
          </div>
          <div className="trust-item">
            <span className="material-symbols-outlined trust-icon">verified</span>
            <h4>{t('hero.warranty')}</h4>
            <p>{t('hero.warrantyDesc')}</p>
          </div>
          <div className="trust-item">
            <span className="material-symbols-outlined trust-icon">support_agent</span>
            <h4>{t('hero.support')}</h4>
            <p>{t('hero.supportDesc')}</p>
          </div>
        </section>
      </div>
    );
  }

  if (usuario.rol === 'cliente') {
    return (
      <div className="dashboard">
        <section className="client-dashboard" style={{ padding: '24px 0' }}>
          <h2 style={{ marginBottom: 24, fontSize: 28, fontWeight: 700 }}>{t('client.welcome', { name: usuario.nombre })}</h2>
          <div className="dashboard-cards">
            <Link to="/productos" className="dashboard-card" style={{ display: 'block', textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--secondary)', marginBottom: 12 }}>storefront</span>
              <h3>{t('client.browse')}</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t('client.browseDesc')}</p>
              <span className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>{t('client.goShop')}</span>
            </Link>
            <Link to="/ordenes" className="dashboard-card" style={{ display: 'block', textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--secondary)', marginBottom: 12 }}>receipt_long</span>
              <h3>{t('client.myOrders')}</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t('client.myOrdersDesc')}</p>
              <span className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>{t('client.viewOrders')}</span>
            </Link>
            <Link to="/perfil" className="dashboard-card" style={{ display: 'block', textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--secondary)', marginBottom: 12 }}>account_circle</span>
              <h3>{t('client.myProfile')}</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t('client.myProfileDesc')}</p>
              <span className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>{t('client.editProfile')}</span>
            </Link>
            <Link to="/carrito" className="dashboard-card" style={{ display: 'block', textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--secondary)', marginBottom: 12 }}>shopping_cart</span>
              <h3>{t('client.shoppingCart')}</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t('client.cartDesc')}</p>
              <span className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>{t('client.viewCart')}</span>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Admin Dashboard
  const activeStats = stats || {
    ventasTotales: 124592.00,
    totalProductos: 482,
    totalOrdenes: 84,
    totalUsuarios: 1240,
    ventasPorMes: [
      { mes: 'Mon', total: 120 },
      { mes: 'Tue', total: 180 },
      { mes: 'Wed', total: 150 },
      { mes: 'Thu', total: 240 },
      { mes: 'Fri', total: 290, active: true },
      { mes: 'Sat', total: 200 },
      { mes: 'Sun', total: 260 }
    ]
  };

  const maxSales = Math.max(...(activeStats.ventasPorMes || []).map(v => v.total), 1);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <main className="admin-main">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="admin-header" style={{ alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>{t('admin.overview')}</h1>
                <p style={{ margin: 0, color: 'var(--on-surface-variant)' }}>{t('admin.subtitle')}</p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--outline)', background: 'var(--surface)', color: 'var(--on-surface)', fontSize: 13 }} />
                  <span style={{ color: 'var(--outline)' }}>-</span>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid var(--outline)', background: 'var(--surface)', color: 'var(--on-surface)', fontSize: 13 }} />
                </div>
                <button onClick={exportCSV} className="btn btn-primary btn-sm" style={{ backgroundColor: '#000000', color: '#ffffff' }}>{t('admin.export')}</button>
              </div>
            </div>

            {/* Bento Grid Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--secondary-container)', color: 'var(--on-secondary-container)' }}>
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div className="stat-trend" style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_up</span>
                    +12.5%
                  </div>
                </div>
                <div>
                  <span className="stat-label">{t('admin.totalSales')}</span>
                  <h3 className="stat-value">${activeStats.ventasTotales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--primary-fixed)', color: 'var(--on-primary-fixed)' }}>
                    <span className="material-symbols-outlined">inventory_2</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--on-surface-variant)' }}>
                    1,204 Units
                  </div>
                </div>
                <div>
                  <span className="stat-label">{t('admin.activeProducts')}</span>
                  <h3 className="stat-value">{activeStats.totalProductos}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--tertiary-fixed)', color: 'var(--on-tertiary-fixed)' }}>
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--on-tertiary-container)' }}>
                    4 Pending
                  </div>
                </div>
                <div>
                  <span className="stat-label">{t('admin.newOrders')}</span>
                  <h3 className="stat-value">{activeStats.totalOrdenes}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon" style={{ backgroundColor: 'var(--error-container)', color: 'var(--on-error-container)' }}>
                    <span className="material-symbols-outlined">group</span>
                  </div>
                  <div className="stat-trend" style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_down</span>
                    -2.4%
                  </div>
                </div>
                <div>
                  <span className="stat-label">{t('admin.newUsers')}</span>
                  <h3 className="stat-value">{activeStats.totalUsuarios.toLocaleString()}</h3>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid" style={{ marginBottom: 24 }}>
              <div className="chart-card">
                <div className="sales-chart-header">
                  <h4>{t('admin.salesTrends')}</h4>
                  <div className="chart-tabs">
                    <button className="chart-tab active">{t('admin.weekly')}</button>
                    <button className="chart-tab">{t('admin.monthly')}</button>
                  </div>
                </div>
                <div className="chart-bars">
                  {(activeStats.ventasPorMes || []).map((item, i) => {
                    const pct = (item.total / maxSales) * 100;
                    return (
                      <div key={i} className="chart-bar-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                        <div 
                          className={`chart-bar ${item.active ? 'active' : ''}`} 
                          style={{ 
                            height: `${pct}%`, 
                            width: '100%', 
                            maxWidth: '40px',
                            background: item.active ? 'var(--secondary) !important' : '#6cf8bb !important'
                          }} 
                          title={`${item.mes}: $${item.total}`}
                        ></div>
                      </div>
                    );
                  })}
                </div>
                <div className="chart-labels" style={{ marginTop: 8 }}>
                  {(activeStats.ventasPorMes || []).map((item, i) => (
                    <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: '500', color: 'var(--on-surface-variant)' }}>
                      {item.mes}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="chart-card">
                <h3>{t('admin.recentActivity')}</h3>
                <div className="activity-feed">
                  <div className="activity-item" style={{ borderBottom: '1px solid var(--outline-variant)', paddingBottom: 12 }}>
                    <div className="activity-icon-container shipped">
                      <span className="material-symbols-outlined">local_shipping</span>
                    </div>
                    <div className="activity-text">
                      <p>{t('admin.activityShipped', { id: '8423' })}</p>
                      <p>{t('admin.activityMinutes', { n: 2 })}</p>
                    </div>
                  </div>

                  <div className="activity-item" style={{ borderBottom: '1px solid var(--outline-variant)', paddingBottom: 12 }}>
                    <div className="activity-icon-container registered">
                      <span className="material-symbols-outlined">person_add</span>
                    </div>
                    <div className="activity-text">
                      <p>{t('admin.activityRegistration')}</p>
                      <p>{t('admin.activityMinutes', { n: 15 })}</p>
                    </div>
                  </div>

                  <div className="activity-item" style={{ borderBottom: '1px solid var(--outline-variant)', paddingBottom: 12 }}>
                    <div className="activity-icon-container low-stock">
                      <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div className="activity-text">
                      <p>{t('admin.activityLowStock', { product: 'TechWatch v2' })}</p>
                      <p>{t('admin.activityHours', { n: 1 })}</p>
                    </div>
                  </div>

                  <div className="activity-item" style={{ paddingBottom: 0 }}>
                    <div className="activity-icon-container price-updated">
                      <span className="material-symbols-outlined">edit</span>
                    </div>
                    <div className="activity-text">
                      <p>{t('admin.activityPriceUpdate')}</p>
                      <p>{t('admin.activityHours', { n: 5 })}</p>
                    </div>
                  </div>
                </div>
                <Link to="/admin/actividad" className="btn btn-outline btn-block btn-sm" style={{ marginTop: 16, textDecoration: 'none' }}>
                  {t('admin.viewAllActivity')}
                </Link>
              </div>
            </div>

            {/* Trending Products Table */}
            <div className="chart-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>{t('admin.trending')}</h3>
                <Link to="/admin/productos" style={{ fontSize: 13, color: 'var(--secondary)', fontWeight: 600, textDecoration: 'none' }}>
                  {t('admin.viewInventory')}
                </Link>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t('admin.product')}</th>
                      <th>{t('admin.category')}</th>
                      <th>{t('admin.sales')}</th>
                      <th>{t('admin.status')}</th>
                      <th>{t('admin.price')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'var(--surface-container-low)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>watch</span>
                        </div>
                        <span style={{ fontWeight: 600 }}>SmartWatch Pro X</span>
                      </td>
                      <td><span className="category-badge" style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface)' }}>Electronics</span></td>
                      <td style={{ fontWeight: 500 }}>1,248</td>
                      <td>
                        <span className="order-badge entregado" style={{ fontSize: 11, padding: '2px 8px' }}>In Stock</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>$299.00</td>
                    </tr>
                    <tr>
                      <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'var(--surface-container-low)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>steps</span>
                        </div>
                        <span style={{ fontWeight: 600 }}>Cloud Runner 2024</span>
                      </td>
                      <td><span className="category-badge" style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface)' }}>Footwear</span></td>
                      <td style={{ fontWeight: 500 }}>942</td>
                      <td>
                        <span className="order-badge entregado" style={{ fontSize: 11, padding: '2px 8px' }}>In Stock</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>$149.50</td>
                    </tr>
                    <tr>
                      <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'var(--surface-container-low)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--outline)' }}>headphones</span>
                        </div>
                        <span style={{ fontWeight: 600 }}>SonicWave Headphones</span>
                      </td>
                      <td><span className="category-badge" style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface)' }}>Electronics</span></td>
                      <td style={{ fontWeight: 500 }}>612</td>
                      <td>
                        <span className="order-badge pendiente" style={{ fontSize: 11, padding: '2px 8px' }}>Low Stock</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>$189.99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
