import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon, FiGlobe, FiLogOut, FiMenu, FiUser } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

const Navbar = ({ onToggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('kisan_lang', nextLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn-icon"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
          style={{ display: 'flex' }}
        >
          <FiMenu size={20} />
        </button>

        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <GiWheat />
          </div>
          <div>
            <span>{t('app.name')}</span>
            <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', fontWeight: 500 }}>
              {t('app.tagline')}
            </span>
          </div>
        </Link>
      </div>

      <div className="navbar-actions">
        {/* Language Switcher */}
        <button
          className="btn btn-outline"
          onClick={toggleLanguage}
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          title="Switch Language (English / हिन्दी)"
        >
          <FiGlobe size={16} />
          <span>{i18n.language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          className="btn-icon"
          onClick={toggleTheme}
          aria-label="Toggle Dark/Light Mode"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>

        {/* User Profile / Auth State */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'var(--bg-surface-raised)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              <FiUser />
              <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Farmer'}
              </span>
            </Link>
            <button
              className="btn-icon"
              onClick={handleLogout}
              title={t('nav.logout')}
              style={{ color: 'var(--danger)' }}
            >
              <FiLogOut size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              {t('nav.login')}
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              {t('nav.register')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
