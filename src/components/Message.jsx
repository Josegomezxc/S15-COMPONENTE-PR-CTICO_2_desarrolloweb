export default function Message({ tipo, mensaje }) {
  if (!mensaje) return null;
  const iconos = { error: 'error', success: 'check_circle', info: 'info' };
  return (
    <div className={`message message-${tipo || 'info'}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
        {iconos[tipo] || 'info'}
      </span>
      {mensaje}
    </div>
  );
}
