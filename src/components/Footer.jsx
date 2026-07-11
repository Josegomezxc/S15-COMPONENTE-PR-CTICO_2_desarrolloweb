import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';

export default function Footer() {
  const { t } = useLanguage();
  const [newsEmail, setNewsEmail] = useState('');

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsEmail.trim()) return;
    try {
      await api.post('/newsletter/subscribe', { email: newsEmail });
      alert('¡Suscripción exitosa!');
      setNewsEmail('');
    } catch {
      alert('Error al suscribirte. Intenta de nuevo.');
    }
  };
  return (
    <footer className="footer">
      <div className="footer-container" style={{ flexDirection: 'column', gap: 24 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24, width: '100%'
        }}>
          <div>
            <span style={{
              fontFamily: "'Geist','Inter',sans-serif", fontSize: 20, fontWeight: 700,
              color: 'var(--primary)', display: 'block', marginBottom: 8
            }}>ProStore</span>
            <p style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h5 style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--primary)', marginBottom: 12, textTransform: 'uppercase' }}>{t('footer.products')}</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/productos" style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>{t('footer.workspace')}</Link>
              <Link to="/productos" style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>{t('footer.hardware')}</Link>
              <Link to="/productos" style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>{t('footer.accessories')}</Link>
            </div>
          </div>
          <div>
            <h5 style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--primary)', marginBottom: 12, textTransform: 'uppercase' }}>{t('footer.company')}</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/about" style={{ fontSize: 14, color: 'var(--on-surface-variant)', textDecoration: 'none' }}>{t('footer.about')}</Link>
              <Link to="/carreras" style={{ fontSize: 14, color: 'var(--on-surface-variant)', textDecoration: 'none' }}>{t('footer.careers')}</Link>
            </div>
          </div>
          <div>
            <h5 style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--primary)', marginBottom: 12, textTransform: 'uppercase' }}>{t('footer.subscribe')}</h5>
            <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 12 }}>{t('footer.subscribeText')}</p>
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input type="email" placeholder={t('footer.email')} value={newsEmail} onChange={(e) => setNewsEmail(e.target.value)} required />
              <button type="submit" className="btn" style={{ background: 'var(--primary)', color: 'var(--on-primary)', padding: '8px 12px', borderRadius: 8 }}>
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid var(--outline-variant)', paddingTop: 16,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '100%'
        }}>
          <p style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>
            &copy; {new Date().getFullYear()} {t('footer.rights')}
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/privacidad" style={{ fontSize: 14, color: 'var(--on-surface-variant)', textDecoration: 'none' }}>{t('footer.privacy')}</Link>
            <Link to="/terminos" style={{ fontSize: 14, color: 'var(--on-surface-variant)', textDecoration: 'none' }}>{t('footer.terms')}</Link>
            <Link to="/contacto" style={{ fontSize: 14, color: 'var(--on-surface-variant)', textDecoration: 'none' }}>{t('footer.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
