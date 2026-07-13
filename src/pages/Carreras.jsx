import { useLanguage } from '../contexts/LanguageContext';

export default function Carreras() {
  const { t } = useLanguage();
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 640 }}>
        <h1>{t('footer.careers')}</h1>
        <p className="auth-subtitle" style={{ fontSize: 15, lineHeight: 1.6 }}>
          {t('careers.subtitle')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
          <div className="dashboard-card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 4 }}>{t('careers.job1.title')}</h3>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t('careers.job1.details')}</p>
          </div>
          <div className="dashboard-card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 4 }}>{t('careers.job2.title')}</h3>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t('careers.job2.details')}</p>
          </div>
          <div className="dashboard-card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 4 }}>{t('careers.job3.title')}</h3>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t('careers.job3.details')}</p>
          </div>
        </div>
        <p style={{ color: 'var(--on-surface-variant)', marginTop: 24, textAlign: 'center' }}>
          {t('careers.sendCV', { email: 'carreras@prostore.com' })}
        </p>
      </div>
    </div>
  );
}
