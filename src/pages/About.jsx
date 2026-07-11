import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 640 }}>
        <h1>{t('footer.about')}</h1>
        <p className="auth-subtitle" style={{ fontSize: 15, lineHeight: 1.6 }}>
          ProStore es una plataforma institucional de comercio electrónico especializada en electrónica profesional
          y soluciones de espacio de trabajo. Desde 2014, proveemos a equipos modernos con equipo de grado industrial,
          respaldado por garantía integral y soporte premium.
        </p>
        <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
          Nuestra misión es dominar tu flujo de trabajo con productos cuidadosamente seleccionados para
          profesionales que exigen lo mejor. Creemos en el minimalismo corporativo: calidad sobre cantidad,
          durabilidad sobre moda, y funcionalidad sobre estética vacía.
        </p>
      </div>
    </div>
  );
}
