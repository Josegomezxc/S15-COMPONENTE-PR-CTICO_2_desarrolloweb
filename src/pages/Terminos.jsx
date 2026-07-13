import { useLanguage } from '../contexts/LanguageContext';

export default function Terminos() {
  const { t } = useLanguage();
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 640 }}>
        <h1>{t('footer.terms')}</h1>
        <div style={{ color: 'var(--on-surface-variant)', fontSize: 14, lineHeight: 1.7 }}>
          <p>{t('terms.lastUpdated')}</p>
          <p>{t('terms.intro')}</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>{t('terms.section1.title')}</h3>
          <p>{t('terms.section1.desc')}</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>{t('terms.section2.title')}</h3>
          <p>{t('terms.section2.desc')}</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>{t('terms.section3.title')}</h3>
          <p>{t('terms.section3.desc')}</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>{t('terms.section4.title')}</h3>
          <p>{t('terms.section4.desc')}</p>
        </div>
      </div>
    </div>
  );
}
