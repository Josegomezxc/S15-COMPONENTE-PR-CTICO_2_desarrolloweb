import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Message from '../components/Message';

export default function Profile() {
  const { usuario, login: refreshAuth } = useAuth();
  const [form, setForm] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    passwordActual: '',
    nuevaPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      await api.put('/usuarios/perfil', form);
      setSuccess('Perfil actualizado correctamente');
      if (refreshAuth) {
        const res = await api.get('/auth/profile');
        localStorage.setItem('token', localStorage.getItem('token'));
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.passwordActual || !passwordForm.nuevaPassword || !passwordForm.confirmPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }

    if (passwordForm.nuevaPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordForm.nuevaPassword !== passwordForm.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      await api.put('/usuarios/cambiar-password', {
        passwordActual: passwordForm.passwordActual,
        nuevaPassword: passwordForm.nuevaPassword
      });
      setPasswordSuccess('Contraseña actualizada correctamente');
      setPasswordForm({ passwordActual: '', nuevaPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.mensaje || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>Mi Perfil</h1>

      <div className="profile-content">
        <div className="profile-card">
          <h2>Información Personal</h2>
          <p className="profile-rol">
            Rol: {usuario?.rol === 'admin' ? 'Administrador' : 'Cliente'}
          </p>
          <Message tipo="error" mensaje={error} />
          <Message tipo="success" mensaje={success} />
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

        <div className="profile-card">
          <h2>Cambiar Contraseña</h2>
          <Message tipo="error" mensaje={passwordError} />
          <Message tipo="success" mensaje={passwordSuccess} />
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Contraseña Actual</label>
              <input
                type="password"
                name="passwordActual"
                value={passwordForm.passwordActual}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                name="nuevaPassword"
                value={passwordForm.nuevaPassword}
                onChange={handlePasswordChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
