import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Message from '../components/Message';

export default function Contacto() {
  const { t } = useLanguage();
  const { usuario } = useAuth();
  const [form, setForm] = useState({ nombre: '', email: usuario?.email || '', mensaje: '' });
  const [msg, setMsg] = useState('');
  const [tipo, setTipo] = useState('success');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      setTipo('error');
      setMsg(t('contact.sendError'));
      return;
    }
    setEnviando(true);
    try {
      const res = await api.post('/contacto', form);
      setTipo('success');
      setMsg(res.data.mensaje);
      setForm({ nombre: '', email: usuario?.email || '', mensaje: '' });
      window.dispatchEvent(new CustomEvent('mensaje-enviado', { detail: { email: form.email } }));
    } catch {
      setTipo('error');
      setMsg(t('contact.error'));
    } finally {
      setEnviando(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <h1>{t('footer.contact')}</h1>
        <p className="auth-subtitle">{t('contact.subtitle')}</p>
        <Message tipo={tipo} mensaje={msg} />
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{t('profile.fullName')}</label>
            <div className="input-icon-wrap">
              <span className="material-symbols-outlined input-icon">person</span>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>{t('profile.email')}</label>
            <div className="input-icon-wrap">
              <span className="material-symbols-outlined input-icon">mail</span>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                readOnly={!!usuario?.email} required
                style={{ background: usuario?.email ? 'var(--surface-container-high)' : 'var(--surface-bright)', cursor: usuario?.email ? 'not-allowed' : 'auto' }}
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('contact.message')}</label>
            <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows="5" required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--outline)', background: 'var(--surface)', color: 'var(--on-surface)', resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? t('contact.sending') : t('contact.send')}
          </button>
        </form>
      </div>
    </div>
  );
}
