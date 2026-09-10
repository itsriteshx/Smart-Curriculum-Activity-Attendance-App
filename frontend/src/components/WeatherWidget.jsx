import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiCloudRain, FiDroplet, FiWind, FiSun } from 'react-icons/fi';
import SpeakButton from './SpeakButton';

const WeatherWidget = ({ weather }) => {
  const { t, i18n } = useTranslation();

  if (!weather) return null;

  const combinedAdvisoryText = weather.advisories
    ? weather.advisories.map(a => (i18n.language === 'hi' && a.textHi ? a.textHi : a.text)).join('. ')
    : '';

  return (
    <div className="card advisory-banner" style={{ display: 'block' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
        <div>
          <span className="badge badge-info" style={{ marginBottom: '8px' }}>
            🌾 {t('dashboard.weatherAlert')}
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {weather.cityName || 'Local Farm Region'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {weather.condition}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary-600)' }}>
              {weather.temperature?.current}°C
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Min: {weather.temperature?.min}°C | Max: {weather.temperature?.max}°C
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiDroplet color="var(--info)" /> {weather.humidity}% Humidity
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiWind color="var(--primary-500)" /> {weather.windSpeed} km/h Wind
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiCloudRain color="var(--accent-500)" /> {weather.rainChance}% Rain Risk
            </span>
          </div>
        </div>
      </div>

      {/* Agro-meteorological advisories list */}
      {weather.advisories && weather.advisories.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Actionable Field Advisories
            </span>
            <SpeakButton textToRead={combinedAdvisoryText} label={t('crops.listen')} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {weather.advisories.map((advisory, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: advisory.level === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-surface)',
                  borderLeft: `4px solid ${advisory.level === 'warning' ? 'var(--warning)' : 'var(--info)'}`,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{advisory.level === 'warning' ? '⚠️' : '💡'}</span>
                <span>{i18n.language === 'hi' && advisory.textHi ? advisory.textHi : advisory.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
