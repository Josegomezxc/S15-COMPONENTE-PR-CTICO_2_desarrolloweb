import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 640 }}>
        <h1>{t('footer.about')}</h1>
        <p className="auth-subtitle" style={{ fontSize: 15, lineHeight: 1.6 }}>
          {t('about.p1')}
        </p>
        <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
          {t('about.p2')}
        </p>
      </div>
    </div>
  );
}
