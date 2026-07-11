import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import Message from '../components/Message';
import AdminSidebar from '../components/AdminSidebar';

export default function ProductForm() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', categoria: '', stock: '', imagen: '' });
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    api.get('/categorias').then(r => setCategorias(r.data)).catch(() => setError(t('form.loadError')));
  }, []);

  useEffect(() => {
    if (isEditing) {
      api.get(`/productos/${id}`).then(r => {
        const p = r.data;
        setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, categoria: p.categoria?._id || '', stock: p.stock, imagen: p.imagen || '' });
      }).catch(() => setError(t('form.loadError')));
    }
  }, [id, isEditing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.descripcion || !form.precio || !form.categoria || form.stock === '') {
      setError(t('form.required')); return;
    }
    try {
      setLoading(true);
      const data = { ...form, precio: Number(form.precio), stock: Number(form.stock) };
      if (isEditing) await api.put(`/productos/${id}`, data);
      else await api.post('/productos', data);
      navigate('/admin/productos');
    } catch (err) {
      setError(err.response?.data?.mensaje || t('form.saveError'));
    } finally { setLoading(false); }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setForm({ ...form, imagen: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <main className="admin-main">
        <div className="product-form-wrap">
          <div className="breadcrumb" style={{ marginBottom: 12 }}>
            <Link to="/admin/productos">{t('form.breadcrumb')}</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
            <span className="active">{isEditing ? t('form.editProduct') : t('form.newProduct')}</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
            {isEditing ? t('form.editProduct') : t('form.newProduct')}
          </h1>
          <p style={{ margin: '0 0 24px 0', color: 'var(--on-surface-variant)' }}>
            {t('form.desc')}
          </p>

          <Message tipo="error" mensaje={error} />

          <form onSubmit={handleSubmit} className="product-form-grid">
            <div className="form-left" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-card">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>{t('form.name')}</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder={t('form.namePlaceholder')}
                    required
                  />
                  <span style={{ fontSize: '12px', color: 'var(--outline)', marginTop: '4px', display: 'block' }}>
                    {t('form.nameHint')}
                  </span>
                </div>
              </div>

              <div className="form-card">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>{t('form.category')}</label>
                  <select name="categoria" value={form.categoria} onChange={handleChange} required>
                    <option value="">{t('form.selectCategory')}</option>
                    {categorias.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-card">
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>{t('form.price')}</label>
                    <input
                      type="number"
                      name="precio"
                      value={form.precio}
                      onChange={handleChange}
                      placeholder={t('form.pricePlaceholder')}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>{t('form.stock')}</label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder={t('form.stockPlaceholder')}
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-card">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>{t('form.description')}</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder={t('form.descriptionHint')}
                    required
                    rows="6"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: '12px', color: 'var(--outline)' }}>{t('form.descriptionMin')}</span>
                    <span style={{ fontSize: '12px', color: 'var(--outline)' }}>{form.descripcion.length}/2000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-right" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
                <label style={{ marginBottom: 12 }}>{t('form.image')}</label>
                <div
                  className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleImageDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                  style={{ cursor: 'pointer', flex: 1 }}
                >
                  {form.imagen ? (
                    <div className="upload-preview" style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <img src={form.imagen} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <button
                        type="button"
                        className="btn-icon danger"
                        style={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={(e) => { e.stopPropagation(); setForm({ ...form, imagen: '' }); }}
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined upload-icon" style={{ fontSize: '40px', color: 'var(--outline)' }}>image_search</span>
                      <p style={{ fontWeight: 600, margin: '8px 0 4px 0', fontSize: '14px' }}>{t('form.imageHint')}</p>
                      <span style={{ fontSize: '12px', color: 'var(--outline)' }}>{t('form.imageSupported')}</span>
                    </>
                  )}
                  <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageDrop} />
                </div>
              </div>

              <div className="form-card">
                <label style={{ marginBottom: 12 }}>{t('form.preview')}</label>
                <div className="preview-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="preview-image" style={{ aspectRatio: '16/10' }}>
                    {form.imagen ? <img src={form.imagen} alt="" /> : <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline-variant)' }}>image</span>}
                    <div className="preview-badge">{t('form.newListing')}</div>
                  </div>
                  <div className="preview-side" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="preview-stat">
                      <span className="stat-label">{t('form.stockStatus')}</span>
                      <h4 style={{ margin: '4px 0 0 0', color: Number(form.stock) > 0 ? 'var(--secondary)' : 'var(--error)' }}>
                        {Number(form.stock) > 99 ? t('form.units', { n: '99+' }) : t('form.units', { n: form.stock || 0 })}
                      </h4>
                      <span style={{ fontSize: 11, color: 'var(--outline)' }}>
                        {Number(form.stock) > 0 ? t('form.highAvailability') : t('form.outOfStock')}
                      </span>
                    </div>
                    <div className="preview-price" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-primary-container)', fontWeight: 700 }}>{t('form.initialPricing')}</span>
                      <h4 style={{ margin: '4px 0 0 0', fontSize: '20px', color: '#ffffff' }}>
                        ${Number(form.precio || 0).toFixed(2)}
                      </h4>
                      <span style={{ fontSize: 11, color: 'var(--on-primary-container)', opacity: 0.8 }}>
                        {t('form.marketCompetitive')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/productos')} style={{ flex: 1 }}>
                  {t('form.cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, backgroundColor: 'var(--secondary)', color: 'var(--on-secondary)' }}>
                  {loading ? t('form.saving') : t('form.save')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
