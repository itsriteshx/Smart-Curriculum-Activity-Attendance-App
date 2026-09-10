import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'farmer',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    farmSize: 4.0,
    soilType: 'alluvial',
    waterAvailability: 'tube_well',
    preferredLanguage: 'hi',
  });

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('Please agree to terms and conditions to proceed.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div className="card fade-in" style={{ maxWidth: '640px', width: '100%', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="brand-icon" style={{ margin: '0 auto 16px', width: '56px', height: '56px', fontSize: '1.8rem' }}>
            <GiWheat />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
            {t('auth.registerTitle')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {t('auth.registerSubtitle')}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div className="form-group">
            <label className="form-label">{t('auth.role')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {['farmer', 'officer', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${formData.role === r ? 'var(--primary-500)' : 'var(--border-color)'}`,
                    background: formData.role === r ? 'var(--primary-50)' : 'var(--bg-surface)',
                    color: formData.role === r ? 'var(--primary-800)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {r === 'farmer' ? '🌾 ' + t('auth.farmer') : r === 'officer' ? '📋 ' + t('auth.officer') : '🛡️ ' + t('auth.admin')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('settings.fullName')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  name="name"
                  className="form-input"
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                />
                <FiUser style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.email')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  name="email"
                  className="form-input"
                  placeholder="farmer@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                />
                <FiMail style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('settings.phone')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  required
                  name="phone"
                  className="form-input"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                />
                <FiPhone style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.password')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                />
                <FiLock style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('settings.state')}</label>
              <select name="state" className="form-select" value={formData.state} onChange={handleChange}>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Bihar">Bihar</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('settings.district')}</label>
              <input
                type="text"
                name="district"
                className="form-input"
                placeholder="District / City"
                value={formData.district}
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.role === 'farmer' && (
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">{t('settings.farmSize')}</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  name="farmSize"
                  className="form-input"
                  value={formData.farmSize}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('settings.soilType')}</label>
                <select name="soilType" className="form-select" value={formData.soilType} onChange={handleChange}>
                  <option value="alluvial">Alluvial (जलोढ़)</option>
                  <option value="black_cotton">Black Cotton (काली मिट्टी)</option>
                  <option value="red_laterite">Red Laterite (लाल मिट्टी)</option>
                  <option value="sandy_loam">Sandy Loam (बलुई दोमट)</option>
                  <option value="clayey">Clayey (चिकनी मिट्टी)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('settings.waterSource')}</label>
                <select name="waterAvailability" className="form-select" value={formData.waterAvailability} onChange={handleChange}>
                  <option value="tube_well">Tube-well / Borewell</option>
                  <option value="canal">Canal Irrigation</option>
                  <option value="rainfed">Rainfed (बारानी)</option>
                  <option value="drip_sprinkler">Drip / Sprinkler</option>
                </select>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>I agree to receive localized agro-advisories, weather alerts, and MSP price notifications.</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : (
              <>
                <span>{t('auth.registerBtn')}</span>
                <FiCheckCircle />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {t('auth.haveAccount')}{' '}
          <Link to="/login" style={{ fontWeight: 700 }}>
            {t('nav.login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
