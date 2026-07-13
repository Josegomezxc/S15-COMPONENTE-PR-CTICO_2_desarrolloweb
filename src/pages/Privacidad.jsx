import { useLanguage } from '../contexts/LanguageContext';

export default function Privacidad() {
  const { t } = useLanguage();
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 640 }}>
        <h1>{t('footer.privacy')}</h1>
        <div style={{ color: 'var(--on-surface-variant)', fontSize: 14, lineHeight: 1.7 }}>
          <p>{t('privacy.lastUpdated')}</p>
          <p>{t('privacy.intro')}</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>{t('privacy.section1.title')}</h3>
          <p>{t('privacy.section1.desc')}</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>{t('privacy.section2.title')}</h3>
          <p>{t('privacy.section2.desc')}</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>{t('privacy.section3.title')}</h3>
          <p>{t('privacy.section3.desc')}</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>{t('privacy.section4.title')}</h3>
          <p>{t('privacy.section4.desc')}</p>
        </div>
      </div>
    </div>
  );
}
