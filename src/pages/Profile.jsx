import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import Message from '../components/Message';
import AdminSidebar from '../components/AdminSidebar';

export default function Profile() {
  const { usuario } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ nombre: usuario?.nombre || '', email: usuario?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ passwordActual: '', nuevaPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      setLoading(true);
      await api.put('/usuarios/perfil', form);
      setSuccess(t('profile.updated'));
    } catch (err) {
      setError(err.response?.data?.mensaje || t('profile.passwordError'));
    } finally { setLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(''); setPasswordSuccess('');
    if (!passwordForm.passwordActual || !passwordForm.nuevaPassword || !passwordForm.confirmPassword) {
      setPasswordError(t('profile.allRequired')); return;
    }
    if (passwordForm.nuevaPassword.length < 6) { setPasswordError(t('profile.passwordMin')); return; }
    if (passwordForm.nuevaPassword !== passwordForm.confirmPassword) { setPasswordError(t('profile.passwordError')); return; }
    try {
      setLoading(true);
      await api.put('/usuarios/cambiar-password', { passwordActual: passwordForm.passwordActual, nuevaPassword: passwordForm.nuevaPassword });
      setPasswordSuccess(t('profile.passwordUpdated'));
      setPasswordForm({ passwordActual: '', nuevaPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.mensaje || t('detailOrder.statusError'));
    } finally { setLoading(false); }
  };

  const isAdmin = usuario?.rol === 'admin';

  const profileContent = (
    <div className="profile-page">
      <h1>{t('profile.title')}</h1>
      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-card-header">
            <span className="material-symbols-outlined">person</span>
            <h2>{t('profile.personalInfo')}</h2>
          </div>
          <p className="profile-role">{t('profile.role', { role: usuario?.rol === 'admin' ? t('profile.administrator') : t('profile.customer') })}</p>
          <Message tipo="error" mensaje={error} />
          <Message tipo="success" mensaje={success} />
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>{t('profile.fullName')}</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">badge</span>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>{t('profile.email')}</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t('profile.saving') : t('profile.saveChanges')}
            </button>
          </form>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <span className="material-symbols-outlined">lock</span>
            <h2>{t('profile.changePassword')}</h2>
          </div>
          <Message tipo="error" mensaje={passwordError} />
          <Message tipo="success" mensaje={passwordSuccess} />
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>{t('profile.currentPassword')}</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input type="password" name="passwordActual" value={passwordForm.passwordActual} onChange={handlePasswordChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>{t('profile.newPassword')}</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">lock_open</span>
                <input type="password" name="nuevaPassword" value={passwordForm.nuevaPassword} onChange={handlePasswordChange} placeholder={t('profile.passwordMin')} required />
              </div>
            </div>
            <div className="form-group">
              <label>{t('profile.confirmPassword')}</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t('profile.changing') : t('profile.changePasswordBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          {profileContent}
        </main>
      </div>
    );
  }

  return profileContent;
}
