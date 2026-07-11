import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Message from '../components/Message';

export default function Contacto() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg('Mensaje enviado. Te contactaremos pronto.');
    setForm({ nombre: '', email: '', mensaje: '' });
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <h1>{t('footer.contact')}</h1>
        <p className="auth-subtitle">Estamos aquí para ayudarte. Envíanos un mensaje.</p>
        <Message tipo="success" mensaje={msg} />
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nombre</label>
            <div className="input-icon-wrap">
              <span className="material-symbols-outlined input-icon">person</span>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-icon-wrap">
              <span className="material-symbols-outlined input-icon">mail</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Mensaje</label>
            <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows="5" required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--outline)', background: 'var(--surface)', color: 'var(--on-surface)', resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Enviar Mensaje</button>
        </form>
      </div>
    </div>
  );
}
