import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminProducts() {
  const { t } = useLanguage();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchProductos = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/productos', { params: { page: p, limit: 10 } });
      const d = res.data;
      setProductos(d.data || d);
      setTotalPages(d.totalPages || 1);
      setTotal(d.total || (d.data || d).length);
      setPage(p);
    } catch { setError(t('adminProducts.loadError')); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProductos(); }, [t]);

  const handleEliminar = async (id) => {
    if (!window.confirm(t('adminProducts.deleteConfirm'))) return;
    try {
      await api.delete(`/productos/${id}`);
      setSuccess(t('adminProducts.deleted'));
      fetchProductos(page);
    } catch { setError(t('adminProducts.deleteError')); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header" style={{ alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>{t('adminProducts.title')}</h1>
            <p style={{ margin: 0, color: 'var(--on-surface-variant)' }}>{t('adminProducts.desc')}</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-filter active" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>filter_list</span>
              {t('adminProducts.filter')}
            </button>
            <button className="btn btn-filter" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
              {t('adminProducts.export')}
            </button>
          </div>
        </div>

        <Message tipo="error" mensaje={error} />
        <Message tipo="success" mensaje={success} />

        {loading ? <LoadingSpinner /> : productos.length === 0 ? (
          <p className="empty-message">{t('adminProducts.empty')}</p>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('adminProducts.image')}</th>
                    <th>{t('adminProducts.name')}</th>
                    <th>{t('adminProducts.category')}</th>
                    <th>{t('adminProducts.price')}</th>
                    <th>{t('adminProducts.stock')}</th>
                    <th>{t('adminProducts.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="product-img">
                          {p.imagen ? <img src={p.imagen} alt={p.nombre} /> : <span className="material-symbols-outlined">image</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{p.nombre}</span>
                          <span className="sku">{t('adminProducts.sku', { code: p._id.slice(-8).toUpperCase() })}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge" style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface)' }}>
                          {p.categoria?.nombre || 'General'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>${p.precio.toFixed(2)}</td>
                      <td>
                        <div className="stock-indicator">
                          <span className={`stock-dot ${p.stock > 0 ? 'available' : 'low'}`} />
                          <span>{t('adminProducts.inStock', { n: p.stock })}</span>
                        </div>
                      </td>
                      <td>
                        <button onClick={() => navigate(`/admin/productos/editar/${p._id}`)} className="btn-edit" style={{ marginRight: 8 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                        </button>
                        <button onClick={() => handleEliminar(p._id)} className="btn-delete">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-footer" style={{ marginTop: 16, borderTop: 'none', background: 'transparent' }}>
              <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>
                {t('adminProducts.showing', { n: productos.length, total })}
              </span>
              <div className="pagination">
                <button className="btn btn-secondary btn-sm" disabled={page <= 1}
                  onClick={() => fetchProductos(page - 1)}
                  style={{ width: 'auto', padding: '6px 12px' }}>&lt;</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => fetchProductos(i + 1)}
                    className={`btn ${page === i + 1 ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ minWidth: 32 }}>{i + 1}</button>
                ))}
                <button className="btn btn-secondary btn-sm" disabled={page >= totalPages}
                  onClick={() => fetchProductos(page + 1)}
                  style={{ width: 'auto', padding: '6px 12px' }}>&gt;</button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
