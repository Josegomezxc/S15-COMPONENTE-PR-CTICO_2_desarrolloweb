import { useLanguage } from '../contexts/LanguageContext';

export default function Carreras() {
  const { t } = useLanguage();
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 640 }}>
        <h1>{t('footer.careers')}</h1>
        <p className="auth-subtitle" style={{ fontSize: 15, lineHeight: 1.6 }}>
          Únete al equipo de ProStore y forma parte de una de las plataformas de comercio electrónico
          institucional de más rápido crecimiento.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
          <div className="dashboard-card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 4 }}>Ingeniero de Software Senior</h3>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>Tiempo completo · Remoto · México</p>
          </div>
          <div className="dashboard-card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 4 }}>Diseñador UX/UI</h3>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>Tiempo completo · Híbrido · CDMX</p>
          </div>
          <div className="dashboard-card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 4 }}>Especialista en Logística</h3>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>Medio tiempo · Presencial · Monterrey</p>
          </div>
        </div>
        <p style={{ color: 'var(--on-surface-variant)', marginTop: 24, textAlign: 'center' }}>
          Envíanos tu CV a <strong>carreras@prostore.com</strong>
        </p>
      </div>
    </div>
  );
}
