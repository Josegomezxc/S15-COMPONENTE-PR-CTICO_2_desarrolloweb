import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import Message from '../components/Message';

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError(t('form.required')); return; }
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      setToken(res.data.token);
      setStep('reset');
      setSuccess(t('forgot.tokenGenerated'));
    } catch (err) {
      setError(err.response?.data?.mensaje || t('login.error'));
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!token || !nuevaPassword) { setError(t('form.required')); return; }
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { token, nuevaPassword });
      setSuccess(t('forgot.passwordUpdated'));
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.mensaje || t('login.error'));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('login.forgot')}</h1>

        <Message tipo="error" mensaje={error} />
        <Message tipo="success" mensaje={success} />

        {step === 'email' && (
          <form onSubmit={handleRequestToken} className="auth-form">
            <div className="form-group">
              <label>{t('login.email')}</label>
              <div className="input-icon-wrap">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('login.emailPlaceholder')} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? t('login.entering') : t('forgot.sendToken')}
            </button>
            <p className="auth-link" style={{ marginTop: 16 }}>
              <Link to="/login">{t('detailOrder.back')}</Link>
            </p>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label>{t('profile.newPassword')}</label>
              <div className="input-icon-wrap">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} placeholder={t('profile.passwordMin')} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? t('profile.changing') : t('profile.changePasswordBtn')}
            </button>
            <p className="auth-link" style={{ marginTop: 16 }}>
              <Link to="/login">{t('detailOrder.back')}</Link>
            </p>
          </form>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/login" className="btn btn-primary">{t('login.enter')}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
