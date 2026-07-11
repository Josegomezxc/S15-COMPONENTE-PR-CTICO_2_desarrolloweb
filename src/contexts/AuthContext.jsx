import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

function getStorage() {
  return localStorage.getItem('rememberMe') === 'true' ? localStorage : sessionStorage;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storage = getStorage();
    const token = storage.getItem('token');
    if (token) {
      api.get('/auth/profile')
        .then((res) => setUsuario(res.data))
        .catch(() => storage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, recordar = true) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('rememberMe', recordar);
    const storage = recordar ? localStorage : sessionStorage;
    storage.setItem('token', res.data.token);
    setUsuario(res.data);
    return res.data;
  };

  const register = async (nombre, email, password) => {
    const res = await api.post('/auth/register', { nombre, email, password });
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('token', res.data.token);
    setUsuario(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
