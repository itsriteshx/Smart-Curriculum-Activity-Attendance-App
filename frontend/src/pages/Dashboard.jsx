import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  weatherService,
  cropService,
  soilService,
  marketService,
  pestService
} from '../services/api';
import WeatherWidget from '../components/WeatherWidget';
import SpeakButton from '../components/SpeakButton';
import {
  FiArrowRight,
  FiActivity,
  FiShield,
  FiTrendingUp,
  FiGrid,
  FiCheckCircle,
  FiAlertTriangle
} from 'react-icons/fi';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [weather, setWeather] = useState(null);
  const [crops, setCrops] = useState([]);
  const [soil, setSoil] = useState(null);
  const [wheatMarket, setWheatMarket] = useState(null);
  const [pestHistory, setPestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [wData, cData, sData, mData, pData] = await Promise.all([
          weatherService.getWeatherAndAdvisory(25.31, 82.97),
          cropService.getRecommendations(),
          soilService.getDiagnostics(),
          marketService.getPrices('Wheat'),
          pestService.getHistory(),
        ]);

        if (wData?.data) setWeather(wData.data);
        if (cData?.data) setCrops(cData.data.slice(0, 3));
        if (sData?.data) setSoil(sData.data);
        if (mData?.data) setWheatMarket(mData.data);
        if (pData?.data) setPestHistory(pData.data);
      } catch (err) {
        console.error('Error fetching dashboard feeds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="fade-in">
      {/* Welcome Banner with Profile Completion */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <span className="badge badge-success" style={{ marginBottom: '8px' }}>
            🌱 {user?.role ? user.role.toUpperCase() : 'FARMER PORTAL'}
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {t('dashboard.welcome')}, {user?.name || 'Kisan Mitra'}!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Farm Location: <strong>{user?.location?.district || 'Varanasi'}, {user?.location?.state || 'Uttar Pradesh'}</strong> | Registered Farm: <strong>4.5 Acres (Alluvial)</strong>
          </p>
        </div>

        {/* Profile Completion Meter */}
        <div style={{ minWidth: '220px', background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>{t('dashboard.profileCompletion')}</span>
            <span style={{ color: 'var(--primary-600)' }}>92%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, var(--primary-500), var(--primary-600))' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
            ✅ Aadhaar & Soil Health Card Linked
          </span>
        </div>
      </div>

      {/* Weather & Real-time Agro-Advisories */}
      <WeatherWidget weather={weather} />

      {/* Quick Actions Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
          ⚡ {t('dashboard.quickActions')}
        </h3>
        <div className="grid-4">
          <Link to="/crops" className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <div className="btn-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-600)', width: '48px', height: '48px' }}>
              <FiGrid size={22} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Recommended Crops</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kharif & Rabi matches</span>
            </div>
          </Link>

          <Link to="/soil" className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <div className="btn-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)', width: '48px', height: '48px' }}>
              <FiActivity size={22} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Fertilizer Calculator</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Urea, DAP, MOP dosage</span>
            </div>
          </Link>

          <Link to="/pest" className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <div className="btn-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', width: '48px', height: '48px' }}>
              <FiShield size={22} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Scan Pest / Disease</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Photo diagnosis & remedy</span>
            </div>
          </Link>

          <Link to="/market" className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <div className="btn-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-500)', width: '48px', height: '48px' }}>
              <FiTrendingUp size={22} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Mandi Rates & Trends</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sell signals & APMC rates</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Feeds */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {/* Top Crop Recommendations */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">🌾 {t('dashboard.recommendationsTitle')}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Matched for your soil & water</p>
            </div>
            <Link to="/crops" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              <span>View All</span>
              <FiArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {crops.map((crop) => (
              <div
                key={crop._id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '1rem' }}>{crop.name}</strong>
                    <span className="badge badge-success">{crop.suitabilityScore}% Match</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Est. Profit: <strong style={{ color: 'var(--primary-600)' }}>₹{crop.estimatedProfit?.toLocaleString('en-IN')}/Acre</strong> | Yield: {crop.expectedYield}
                  </p>
                </div>
                <SpeakButton
                  textToRead={`${crop.name}. Suitability score ${crop.suitabilityScore} percent. Expected profit rupees ${crop.estimatedProfit} per acre.`}
                  label=""
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mandi Market Intelligence Preview */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">📈 {t('dashboard.marketWatchTitle')}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time Mandi procurement rates</p>
            </div>
            <Link to="/market" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              <span>Trends</span>
              <FiArrowRight size={14} />
            </Link>
          </div>

          {wheatMarket && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Commodity</span>
                  <strong style={{ fontSize: '1.1rem' }}>{wheatMarket.crop}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Current Price</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                    ₹{wheatMarket.currentPrice}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / Quintal</span>
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: wheatMarket.advice === 'HOLD' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${wheatMarket.advice === 'HOLD' ? 'var(--warning)' : 'var(--success)'}`, marginBottom: '14px' }}>
                <strong style={{ fontSize: '0.9rem', color: wheatMarket.advice === 'HOLD' ? 'var(--accent-600)' : 'var(--primary-700)', display: 'block', marginBottom: '4px' }}>
                  📊 Sell Signal: {wheatMarket.advice === 'HOLD' ? t('market.hold') : t('market.sellNow')}
                </strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {i18n.language === 'hi' && wheatMarket.adviceReasonHi ? wheatMarket.adviceReasonHi : wheatMarket.adviceReason}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Govt MSP: <strong>₹{wheatMarket.msp}/Q</strong></span>
                <span>Mandi High: <strong>₹{wheatMarket.maxPrice}/Q</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Soil Status & Pest Watch Grid */}
      <div className="grid-2">
        {/* Soil Health Status */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">🧪 {t('dashboard.soilTestDue')}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t('dashboard.lastTested')}: <strong>{soil?.testDate || 'Aug 2026'}</strong>
              </p>
            </div>
            <Link to="/soil" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              <span>Diagnose</span>
            </Link>
          </div>

          <div className="grid-4" style={{ textAlign: 'center' }}>
            <div style={{ padding: '12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Nitrogen (N)</span>
              <strong style={{ color: 'var(--danger)', fontSize: '1.1rem' }}>Low</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>185 kg/ha</span>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Phosphorus (P)</span>
              <strong style={{ color: 'var(--warning)', fontSize: '1.1rem' }}>Medium</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>34 kg/ha</span>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Potassium (K)</span>
              <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>Optimal</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>240 kg/ha</span>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>pH Level</span>
              <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>6.8</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Neutral</span>
            </div>
          </div>
        </div>

        {/* Pest Watch Status */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">🛡️ {t('dashboard.pestAlertsTitle')}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Regional outbreak surveillance</p>
            </div>
            <Link to="/pest" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              <span>Scan Photo</span>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiAlertTriangle color="var(--danger)" size={24} />
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--danger)', display: 'block' }}>
                  Yellow Rust Alert in Wheat belt
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Active spore dispersion reported in nearby districts. Apply preventive Neem spray.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <span>Recent Diagnostics: <strong>2 Resolved Reports</strong></span>
              <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiCheckCircle /> Healthy Status
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
