import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import Message from '../components/Message';
import AdminSidebar from '../components/AdminSidebar';

export default function Profile() {
  const { usuario, actualizarUsuario } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ nombre: '', email: '' });
  const [isDirty, setIsDirty] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [fotoChanged, setFotoChanged] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ passwordActual: '', nuevaPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setForm({ nombre: usuario.nombre || '', email: usuario.email || '' });
      setIsDirty(false);
    }
  }, [usuario]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (!isDirty) setIsDirty(true);
  };
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewFoto(reader.result);
        setFotoChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      setLoading(true);
      const datos = { ...form };
      if (fotoChanged && previewFoto) datos.foto = previewFoto;
      const res = await api.put('/usuarios/perfil', datos);
      actualizarUsuario({ ...usuario, ...res.data });
      setIsDirty(false);
      setFotoChanged(false);
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

  const hasChanges = isDirty || fotoChanged;
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
          <div className="profile-photo-section">
            <div className="profile-photo" onClick={() => fileInputRef.current?.click()}>
              {previewFoto || usuario?.foto ? (
                <img src={previewFoto || usuario?.foto} alt={t('profile.photoAlt')} />
              ) : (
                <span className="material-symbols-outlined">person</span>
              )}
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>photo_camera</span>
              {t('profile.changePhoto')}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </div>
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
            <button type="submit" className="btn btn-primary" disabled={loading || !hasChanges} title={!hasChanges ? '🔒' : ''}>
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
