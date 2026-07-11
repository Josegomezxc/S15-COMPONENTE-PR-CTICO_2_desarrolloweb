export default function Message({ tipo, mensaje }) {
  if (!mensaje) return null;

  return (
    <div className={`message message-${tipo || 'info'}`}>
      {mensaje}
    </div>
  );
}
