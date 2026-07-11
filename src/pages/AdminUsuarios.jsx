import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminUsuarios() {
  const { t } = useLanguage();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/usuarios')
      .then((res) => setUsuarios(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header" style={{ alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
              {t('admin.customers')}
            </h1>
            <p style={{ margin: 0, color: 'var(--on-surface-variant)' }}>{usuarios.length} usuarios registrados</p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>NOMBRE</th>
                <th>EMAIL</th>
                <th>ROL</th>
                <th>REGISTRO</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`order-badge ${u.rol === 'admin' ? 'entregado' : 'pendiente'}`} style={{ fontSize: 11, padding: '2px 8px' }}>
                      {u.rol === 'admin' ? t('profile.administrator') : t('profile.customer')}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
