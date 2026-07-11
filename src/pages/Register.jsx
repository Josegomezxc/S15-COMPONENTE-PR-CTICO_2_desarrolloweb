import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Message from '../components/Message';

export default function Register() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });
  const [terminos, setTerminos] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const strength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.email || !form.password || !form.confirmPassword) {
      setError(t('form.required'));
      return;
    }
    if (form.password.length < 6) {
      setError(t('profile.passwordMin'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t('profile.passwordError'));
      return;
    }
    if (!terminos) {
      setError(t('register.termsError'));
      return;
    }
    try {
      setLoading(true);
      await register(form.nombre, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || t('register.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('register.title')}</h1>
        <p className="auth-subtitle">{t('register.subtitle')}</p>
        
        <Message tipo="error" mensaje={error} />
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{t('register.name')}</label>
            <div className="input-icon-wrap">
              <span className="material-symbols-outlined input-icon">person</span>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder={t('register.namePlaceholder')} required />
            </div>
          </div>
          
          <div className="form-group">
            <label>{t('register.email')}</label>
            <div className="input-icon-wrap">
              <span className="material-symbols-outlined input-icon">mail</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder={t('register.emailPlaceholder')} required />
            </div>
          </div>
          
          <div className="form-group">
            <label>{t('register.password')}</label>
            <div className="input-icon-wrap">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
            </div>
            {form.password && (
              <div className="strength-bar">
                <div className="segment">
                  <div className="fill" style={{ width: strength() >= 1 ? '100%' : '0', backgroundColor: strength() === 1 ? 'var(--error)' : strength() === 2 ? 'var(--on-tertiary-container)' : 'var(--secondary)' }}></div>
                </div>
                <div className="segment">
                  <div className="fill" style={{ width: strength() >= 2 ? '100%' : '0', backgroundColor: strength() === 2 ? 'var(--on-tertiary-container)' : 'var(--secondary)' }}></div>
                </div>
                <div className="segment">
                  <div className="fill" style={{ width: strength() >= 3 ? '100%' : '0', backgroundColor: 'var(--secondary)' }}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>{t('register.confirmPassword')}</label>
            <div className="input-icon-wrap">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <input type="checkbox" id="terminos" checked={terminos} onChange={() => setTerminos(!terminos)} style={{ width: 'auto', cursor: 'pointer' }} />
            <label htmlFor="terminos" style={{ margin: 0, fontWeight: '500', fontSize: '13px', cursor: 'pointer', color: 'var(--on-surface-variant)' }}>
              {t('register.terms')}
            </label>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? t('register.creating') : t('register.create')}
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </button>
        </form>
        
        <div className="divider">
          <div className="divider-line"><hr /></div>
          <div className="divider-text"><span>{t('register.or')}</span></div>
        </div>
        
        <div className="social-buttons">
          <button className="social-btn" onClick={() => setError('Registro social no disponible aún')}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {t('register.google')}
          </button>
          <button className="social-btn" onClick={() => setError('Registro social no disponible aún')}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            {t('register.apple')}
          </button>
          <button className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            {t('register.apple')}
          </button>
        </div>
        
        <p className="auth-link">
          {t('register.hasAccount')} <Link to="/login">{t('register.login')}</Link>
        </p>
      </div>
    </div>
  );
}
