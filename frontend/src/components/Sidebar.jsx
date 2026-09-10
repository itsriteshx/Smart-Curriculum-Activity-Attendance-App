import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiHome,
  FiGrid,
  FiActivity,
  FiShield,
  FiTrendingUp,
  FiSettings,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t('nav.dashboard'), icon: <FiHome /> },
    { path: '/crops', label: t('nav.crops'), icon: <FiGrid /> },
    { path: '/soil', label: t('nav.soil'), icon: <FiActivity /> },
    { path: '/pest', label: t('nav.pest'), icon: <FiShield /> },
    { path: '/market', label: t('nav.market'), icon: <FiTrendingUp /> },
    { path: '/settings', label: t('nav.settings'), icon: <FiSettings /> },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Menu
          </span>
          <button
            className="btn-icon"
            onClick={onClose}
            style={{ width: '32px', height: '32px' }}
            aria-label="Close Sidebar"
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  onClose();
                }
              }}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ background: 'var(--primary-50)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '4px' }}>
              🌾 Kisan Helpline
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>
              Toll Free: 1800-180-1551
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
