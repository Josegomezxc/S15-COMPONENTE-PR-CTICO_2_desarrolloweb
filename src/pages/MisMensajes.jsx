import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MisMensajes() {
  const { t } = useLanguage();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario?.rol === 'admin') navigate('/admin/mensajes', { replace: true });
  }, [usuario, navigate]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/contacto/mis-mensajes')
      .then((res) => setMensajes(res.data || []))
      .catch(() => setMensajes([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="product-layout">
      <main className="product-main" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 8 }}>{t('misMensajes.title')}</h1>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: 32 }}>{t('misMensajes.subtitle')}</p>

        {mensajes.length === 0 ? (
          <div className="empty-cart">
            <span className="material-symbols-outlined empty-icon">mail</span>
            <h2>{t('misMensajes.empty')}</h2>
            <p>{t('misMensajes.emptyDesc')}</p>
            <Link to="/contacto" className="btn btn-primary">{t('misMensajes.contact')}</Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('adminMessages.date')}</th>
                  <th>{t('adminMessages.status')}</th>
                  <th>{t('adminMessages.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {mensajes.map((m, i) => (
                  <tr key={m._id} style={{ animation: `fadeInUp 0.4s var(--ease-out) both`, animationDelay: `${i * 0.06}s` }}>
                    <td>{formatDate(m.createdAt)}</td>
                    <td>
                      <span className={`order-badge ${m.respondido ? 'entregado' : 'pendiente'}`}>
                        {m.respondido ? t('adminMessages.answered') : t('adminMessages.pending')}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => setSelected(m)}>
                        {t('adminMessages.view')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {selected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          animation: 'fadeInUp 0.3s var(--ease-out) both'
        }} onClick={() => setSelected(null)}>
          <div style={{
            background: 'var(--surface-container-lowest)', borderRadius: 16,
            padding: 32, maxWidth: 600, width: '90%', maxHeight: '85vh',
            overflowY: 'auto', border: '1px solid var(--outline-variant)',
            boxShadow: 'var(--shadow-xl)', margin: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: 'var(--primary)', fontSize: 20, fontWeight: 600 }}>{t('adminMessages.view')}</h3>
              <button className="btn-icon" onClick={() => setSelected(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>{t('adminMessages.date')}</label>
                <div style={{ padding: '8px 12px', background: 'var(--surface-container-low)', borderRadius: 8, color: 'var(--on-surface-variant)' }}>{formatDate(selected.createdAt)}</div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>{t('adminMessages.status')}</label>
                <div style={{ padding: '8px 12px' }}>
                  <span className={`order-badge ${selected.respondido ? 'entregado' : 'pendiente'}`}>
                    {selected.respondido ? t('adminMessages.answered') : t('adminMessages.pending')}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>{t('adminMessages.message')}</label>
              <div style={{
                padding: 16, background: 'var(--surface-container-low)',
                borderRadius: 8, lineHeight: 1.6, whiteSpace: 'pre-wrap'
              }}>{selected.mensaje}</div>
            </div>

            {selected.respondido && (
              <div style={{
                padding: 16, background: 'var(--secondary-container)',
                borderRadius: 8, marginTop: 16
              }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--on-secondary-container)' }}>
                  {t('misMensajes.response')}
                </div>
                <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--on-secondary-container)' }}>
                  {selected.respuesta}
                </div>
                <div style={{ fontSize: 12, color: 'var(--on-secondary-container)', marginTop: 8, opacity: 0.7 }}>
                  {selected.respondidoPor?.nombre} &mdash; {formatDate(selected.respondidoAt)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
