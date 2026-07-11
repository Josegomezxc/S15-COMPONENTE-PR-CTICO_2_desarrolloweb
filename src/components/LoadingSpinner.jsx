export default function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{ marginTop: 16, color: 'var(--on-surface-variant)' }}>Cargando...</p>
    </div>
  );
}
