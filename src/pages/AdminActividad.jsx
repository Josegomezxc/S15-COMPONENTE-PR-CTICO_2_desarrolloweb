import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminActividad() {
  const { t } = useLanguage();
  const [actividad, setActividad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/activity')
      .then((res) => setActividad(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const iconFor = (tipo) => {
    if (tipo === 'orden') return 'local_shipping';
    if (tipo === 'stock') return 'warning';
    if (tipo === 'registro') return 'person_add';
    return 'notifications';
  };

  const colorFor = (tipo) => {
    if (tipo === 'orden') return 'shipped';
    if (tipo === 'stock') return 'low-stock';
    if (tipo === 'registro') return 'registered';
    return 'price-updated';
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header" style={{ marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
              {t('admin.recentActivity')}
            </h1>
            <p style={{ margin: 0, color: 'var(--on-surface-variant)' }}>{t('admin.activityFullLog')}</p>
          </div>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="chart-card" style={{ padding: 20 }}>
            {actividad.length === 0 ? (
              <p style={{ textAlign: 'center', padding: 48, color: 'var(--on-surface-variant)' }}>{t('admin.noActivity')}</p>
            ) : (
              <div className="activity-feed">
                {actividad.map((item, i) => (
                  <div key={i} className="activity-item" style={{ borderBottom: i < actividad.length - 1 ? '1px solid var(--outline-variant)' : 'none', paddingBottom: i < actividad.length - 1 ? 12 : 0, marginBottom: i < actividad.length - 1 ? 12 : 0 }}>
                    <div className={`activity-icon-container ${colorFor(item.tipo)}`}>
                      <span className="material-symbols-outlined">{iconFor(item.tipo)}</span>
                    </div>
                    <div className="activity-text">
                      <p>{item.detalle}: {item.texto}</p>
                      <p>{item.haceMinutos < 60 ? t('admin.activityMinutes', { n: item.haceMinutos }) : t('admin.activityHours', { n: Math.floor(item.haceMinutos / 60) })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
