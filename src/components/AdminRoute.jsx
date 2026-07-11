import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { usuario, loading } = useAuth();

  if (loading) return <div className="loading">Cargando...</div>;
  if (!usuario || usuario.rol !== 'admin') return <Navigate to="/" />;

  return children;
}
