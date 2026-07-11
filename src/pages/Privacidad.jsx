import { useLanguage } from '../contexts/LanguageContext';

export default function Privacidad() {
  const { t } = useLanguage();
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 640 }}>
        <h1>{t('footer.privacy')}</h1>
        <div style={{ color: 'var(--on-surface-variant)', fontSize: 14, lineHeight: 1.7 }}>
          <p><strong>Última actualización:</strong> Enero 2025</p>
          <p>En ProStore, valoramos tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>Información que recopilamos</h3>
          <p>Recopilamos información que nos proporcionas directamente, como nombre, correo electrónico y dirección de envío cuando creas una cuenta o realizas una compra.</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>Uso de la información</h3>
          <p>Utilizamos tu información para procesar pedidos, mejorar nuestros servicios y comunicarnos contigo sobre tu cuenta.</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>Protección de datos</h3>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado.</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>Contacto</h3>
          <p>Si tienes preguntas sobre esta política, contáctanos en privacidad@prostore.com</p>
        </div>
      </div>
    </div>
  );
}
