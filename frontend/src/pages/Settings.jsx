import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { farmerService } from '../services/api';
import {
  FiUser,
  FiLock,
  FiGlobe,
  FiMoon,
  FiSun,
  FiCheckCircle,
  FiSave
} from 'react-icons/fi';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: user?.name || 'Ramesh Patel',
    phone: user?.phone || '9876543210',
    state: user?.location?.state || 'Uttar Pradesh',
    district: user?.location?.district || 'Varanasi',
    farmSize: 4.5,
    soilType: 'alluvial',
    waterAvailability: 'tube_well',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: formData.name,
      phone: formData.phone,
      location: { state: formData.state, district: formData.district }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPassSuccess(true);
    setPasswordData({ oldPassword: '', newPassword: '' });
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('kisan_lang', lang);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          ⚙️ {t('settings.title')}
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your farm profile, language, notifications, and security preferences.
        </p>
      </div>

      {/* Preferences Section: Language & Theme */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 className="card-title" style={{ marginBottom: '16px' }}>
          🌐 App Experience Preferences
        </h3>

        <div className="grid-2">
          {/* Language Toggle */}
          <div className="form-group">
            <label className="form-label">{t('settings.languagePref')}</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${i18n.language === 'en' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => handleLanguageChange('en')}
              >
                English
              </button>
              <button
                type="button"
                className={`btn ${i18n.language === 'hi' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => handleLanguageChange('hi')}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="form-group">
            <label className="form-label">{t('settings.theme')}</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => theme === 'dark' && toggleTheme()}
              >
                <FiSun /> {t('settings.light')}
              </button>
              <button
                type="button"
                className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => theme === 'light' && toggleTheme()}
              >
                <FiMoon /> {t('settings.dark')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal & Farm Profile Editor */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">👨‍🌾 {t('settings.farmerDetails')}</h3>
          {saveSuccess && (
            <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiCheckCircle /> Saved successfully!
            </span>
          )}
        </div>

        <form onSubmit={handleProfileSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('settings.fullName')}</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('settings.phone')}</label>
              <input
                type="tel"
                required
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('settings.state')}</label>
              <input
                type="text"
                className="form-input"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('settings.district')}</label>
              <input
                type="text"
                className="form-input"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">{t('settings.farmSize')}</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                className="form-input"
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: parseFloat(e.target.value) || 1 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('settings.soilType')}</label>
              <select
                className="form-select"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              >
                <option value="alluvial">Alluvial (जलोढ़)</option>
                <option value="black_cotton">Black Cotton (काली मिट्टी)</option>
                <option value="red_laterite">Red Laterite (लाल)</option>
                <option value="sandy_loam">Sandy Loam (दोमट)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('settings.waterSource')}</label>
              <select
                className="form-select"
                value={formData.waterAvailability}
                onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
              >
                <option value="tube_well">Tube-well / Borewell</option>
                <option value="canal">Canal Irrigation</option>
                <option value="rainfed">Rainfed (बारानी)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            <FiSave /> {t('settings.saveChanges')}
          </button>
        </form>
      </div>

      {/* Security & Password Form */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🔒 {t('settings.changePassword')}</h3>
          {passSuccess && (
            <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiCheckCircle /> Password updated!
            </span>
          )}
        </div>

        <form onSubmit={handlePasswordSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t('settings.oldPassword')}</label>
              <input
                type="password"
                required
                className="form-input"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('settings.newPassword')}</label>
              <input
                type="password"
                required
                className="form-input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-outline">
            <FiLock /> {t('settings.updatePasswordBtn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
