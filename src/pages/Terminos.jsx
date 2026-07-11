import { useLanguage } from '../contexts/LanguageContext';

export default function Terminos() {
  const { t } = useLanguage();
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 640 }}>
        <h1>{t('footer.terms')}</h1>
        <div style={{ color: 'var(--on-surface-variant)', fontSize: 14, lineHeight: 1.7 }}>
          <p><strong>Última actualización:</strong> Enero 2025</p>
          <p>Al acceder y utilizar ProStore, aceptas cumplir con estos términos de servicio.</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>Uso del servicio</h3>
          <p>ProStore proporciona una plataforma para la compra de productos electrónicos y soluciones de espacio de trabajo. Debes ser mayor de 18 años para utilizar nuestros servicios.</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>Cuentas de usuario</h3>
          <p>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Notifícanos inmediatamente sobre cualquier uso no autorizado.</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>Precios y pagos</h3>
          <p>Todos los precios están en pesos mexicanos (MXN) e incluyen impuestos aplicables. Nos reservamos el derecho de modificar precios en cualquier momento.</p>
          <h3 style={{ marginTop: 20, color: 'var(--on-surface)' }}>Envíos y devoluciones</h3>
          <p>Ofrecemos envíos a toda la república mexicana. Las devoluciones son aceptadas dentro de los 30 días posteriores a la recepción.</p>
        </div>
      </div>
    </div>
  );
}
