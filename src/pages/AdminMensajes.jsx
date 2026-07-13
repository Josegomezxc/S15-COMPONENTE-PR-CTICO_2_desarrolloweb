import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminMensajes() {
  const { t } = useLanguage();
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtro, setFiltro] = useState('');
  const [selected, setSelected] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState('');
  const [tipoMsg, setTipoMsg] = useState('success');

  const cargar = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 10 };
      if (filtro) params.filtro = filtro;
      const res = await api.get('/contacto', { params });
      const d = res.data;
      setMensajes(d.data || []);
      setTotalPages(d.totalPages || 1);
      setPage(d.page || 1);
    } catch {
      setMensajes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(1); }, [filtro]);

  const abrirModal = async (id) => {
    try {
      const res = await api.get(`/contacto/${id}`);
      setSelected(res.data);
      setRespuesta('');
    } catch {
      setTipoMsg('error');
      setMsg(t('admin.loadMessageError'));
    }
  };

  const responder = async () => {
    if (!respuesta.trim()) return;
    setEnviando(true);
    try {
      await api.put(`/contacto/${selected._id}/responder`, { respuesta });
      setTipoMsg('success');
      setMsg(t('adminMessages.responseSent'));
      setSelected(null);
      cargar(page);
    } catch {
      setTipoMsg('error');
      setMsg(t('adminMessages.responseError'));
    } finally {
      setEnviando(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
        <div>
          <h2>{t('adminMessages.title')}</h2>
          <p>{t('adminMessages.desc')}</p>
        </div>
        <div className="admin-actions">
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="btn-filter">
            <option value="">{t('adminMessages.all')}</option>
            <option value="pendiente">{t('adminMessages.pending')}</option>
            <option value="respondido">{t('adminMessages.answered')}</option>
          </select>
        </div>
      </div>

      <Message tipo={tipoMsg} mensaje={msg} />

      {loading ? <LoadingSpinner /> : (
        <div className="admin-table-wrap">
          {mensajes.length === 0 ? (
            <div className="empty-message">{t('adminMessages.empty')}</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('adminMessages.name')}</th>
                  <th>{t('adminMessages.email')}</th>
                  <th>{t('adminMessages.date')}</th>
                  <th>{t('adminMessages.status')}</th>
                  <th>{t('adminMessages.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {mensajes.map((m) => (
                  <tr key={m._id}>
                    <td style={{ fontWeight: 600 }}>{m.nombre}</td>
                    <td>{m.email}</td>
                    <td>{formatDate(m.createdAt)}</td>
                    <td>
                      <span className={`order-badge ${m.respondido ? 'entregado' : 'pendiente'}`}>
                        {m.respondido ? t('adminMessages.answered') : t('adminMessages.pending')}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => abrirModal(m._id)}>
                        {m.respondido ? t('adminMessages.view') : t('adminMessages.respond')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {totalPages > 1 && (
            <div className="table-footer">
              <div className="pagination-info">{t('adminProducts.showing', { n: mensajes.length, total: '...' })}</div>
              <div className="pagination">
                <button disabled={page <= 1} onClick={() => cargar(page - 1)}>&laquo;</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={p === page ? 'active' : ''} onClick={() => cargar(p)}>{p}</button>
                ))}
                <button disabled={page >= totalPages} onClick={() => cargar(page + 1)}>&raquo;</button>
              </div>
            </div>
          )}
        </div>
      )}

      {selected && createPortal(
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          animation: 'fadeInUp 0.3s var(--ease-out) both'
        }} onClick={() => setSelected(null)}>
          <div style={{
            background: 'var(--surface-container-lowest)', borderRadius: 16,
            padding: 32, maxWidth: 800, width: '90%', maxHeight: '85vh',
            overflowY: 'auto', border: '1px solid var(--outline-variant)',
            boxShadow: 'var(--shadow-xl)', margin: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: 'var(--primary)', fontSize: 20, fontWeight: 600 }}>
                {selected.respondido ? t('adminMessages.view') : t('adminMessages.respond')}
              </h3>
              <button className="btn-icon" onClick={() => setSelected(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>{t('profile.fullName')}</label>
                <div style={{ padding: '8px 12px', fontWeight: 600, background: 'var(--surface-container-low)', borderRadius: 8 }}>{selected.nombre}</div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>{t('profile.email')}</label>
                <div style={{ padding: '8px 12px', background: 'var(--surface-container-low)', borderRadius: 8 }}>{selected.email}</div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>{t('adminMessages.date')}</label>
                <div style={{ padding: '8px 12px', color: 'var(--on-surface-variant)', background: 'var(--surface-container-low)', borderRadius: 8 }}>{formatDate(selected.createdAt)}</div>
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
                borderRadius: 8, marginBottom: 16
              }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--on-secondary-container)' }}>
                  {t('adminMessages.yourResponse')}
                </div>
                <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--on-secondary-container)' }}>
                  {selected.respuesta}
                </div>
                <div style={{ fontSize: 12, color: 'var(--on-secondary-container)', marginTop: 8, opacity: 0.7 }}>
                  {selected.respondidoPor?.nombre} — {formatDate(selected.respondidoAt)}
                </div>
              </div>
            )}

            {!selected.respondido && (
              <div className="form-group">
                <label>{t('adminMessages.response')}</label>
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  rows="4"
                  placeholder={t('adminMessages.responsePlaceholder')}
                  style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--outline-variant)', background: 'var(--surface)', color: 'var(--on-surface)', resize: 'vertical', fontFamily: 'inherit' }}
                />
                <button
                  className="btn btn-primary btn-block"
                  onClick={responder}
                  disabled={enviando || !respuesta.trim()}
                  style={{ marginTop: 12 }}
                >
                  {enviando ? t('adminMessages.sending') : t('adminMessages.sendResponse')}
                </button>
              </div>
            )}
          </div>
        </div>
      , document.body)}
      </main>
    </div>
  );
}
