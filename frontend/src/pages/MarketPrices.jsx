import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { marketService } from '../services/api';
import VoiceButton from '../components/VoiceButton';
import SpeakButton from '../components/SpeakButton';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  FiSearch,
  FiTrendingUp,
  FiBell,
  FiDownload,
  FiCheck,
  FiMapPin
} from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MarketPrices = () => {
  const { t, i18n } = useTranslation();

  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [marketData, setMarketData] = useState(null);
  const [alertTargetPrice, setAlertTargetPrice] = useState(2600);
  const [alertSaved, setAlertSaved] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      const res = await marketService.getPrices(selectedCrop);
      if (res?.data) {
        setMarketData(res.data);
      }
    };
    fetchPrices();
  }, [selectedCrop]);

  const handleVoiceInput = (text) => {
    const clean = text.trim().toLowerCase();
    if (clean.includes('paddy') || clean.includes('rice') || clean.includes('dhan') || clean.includes('धान')) {
      setSelectedCrop('Paddy');
    } else if (clean.includes('wheat') || clean.includes('gehun') || clean.includes('gehu') || clean.includes('गेहूं')) {
      setSelectedCrop('Wheat');
    } else {
      setSelectedCrop('Wheat');
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    await marketService.createAlert({
      cropName: selectedCrop,
      targetPrice: alertTargetPrice,
      farmerId: 'demo'
    });
    setAlertSaved(true);
    setTimeout(() => setAlertSaved(false), 3000);
  };

  const handleExportCSV = () => {
    if (!marketData?.history30d) return;
    const headers = 'Day,Commodity,Price_INR_per_Quintal\n';
    const rows = marketData.history30d.map(item => `${item.day},${selectedCrop},${item.price}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedCrop}_mandi_rates_30d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = {
    labels: marketData?.history30d?.map(d => d.day) || [],
    datasets: [
      {
        label: `${selectedCrop} (₹/Quintal)`,
        data: marketData?.history30d?.map(d => d.price) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#059669',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y} / Quintal`,
        },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
      },
    },
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          📈 {t('market.title')}
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('market.subtitle')}
        </p>
      </div>

      {/* Search & Voice Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-input"
            placeholder={t('market.searchPlaceholder')}
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            style={{ paddingLeft: '40px', paddingRight: '44px' }}
          />
          <FiSearch style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
          <div style={{ position: 'absolute', right: '4px', top: '4px' }}>
            <VoiceButton onTranscript={handleVoiceInput} title={t('market.voiceSearch')} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['Wheat', 'Paddy'].map(crop => (
            <button
              key={crop}
              type="button"
              className={`btn ${selectedCrop === crop ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => setSelectedCrop(crop)}
            >
              {crop === 'Wheat' ? '🌾 Wheat (गेहूं)' : '🌱 Paddy (धान)'}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportCSV}
            title={t('market.exportCsv')}
            style={{ fontSize: '0.85rem' }}
          >
            <FiDownload /> {t('market.exportCsv')}
          </button>
        </div>
      </div>

      {marketData && (
        <>
          {/* Price Overview Banner */}
          <div className="grid-3" style={{ marginBottom: '24px' }}>
            <div className="card" style={{ borderLeft: '5px solid var(--primary-500)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('market.currentPrice')}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '6px 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                  ₹{marketData.currentPrice}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ Quintal</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                MSP Floor: <strong>₹{marketData.msp}/Q</strong>
              </span>
            </div>

            <div className="card" style={{ borderLeft: '5px solid var(--accent-500)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>30-Day Range</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '6px 0' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                  ₹{marketData.minPrice} - ₹{marketData.maxPrice}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Spread: ₹{marketData.maxPrice - marketData.minPrice}/Q
              </span>
            </div>

            <div className="card" style={{ borderLeft: `5px solid ${marketData.advice === 'HOLD' ? 'var(--warning)' : 'var(--success)'}` }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('market.bestTimeToSell')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0' }}>
                <span className={`badge ${marketData.advice === 'HOLD' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                  {marketData.advice === 'HOLD' ? t('market.hold') : t('market.sellNow')}
                </span>
                <SpeakButton textToRead={i18n.language === 'hi' ? marketData.adviceReasonHi : marketData.adviceReason} label="" />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {i18n.language === 'hi' ? marketData.adviceReasonHi : marketData.adviceReason}
              </p>
            </div>
          </div>

          {/* Chart & Mandi Rates Table */}
          <div className="grid-2" style={{ marginBottom: '32px' }}>
            {/* 30-Day Historical Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📊 {t('market.priceTrend')}</h3>
                <span className="badge badge-info">30 Days</span>
              </div>
              <div style={{ height: '280px', width: '100%' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* APMC Mandi Comparison Table & Price Alert Setup */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Nearby Mandis */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">🏢 Regional APMC Mandis</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live Quotes</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {marketData.mandis?.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        background: 'var(--bg-surface-raised)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FiMapPin color="var(--primary-500)" size={14} /> {m.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Daily Arrival: {m.arrival}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                          ₹{m.price}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> /Q</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Set Price Alert Form */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">🔔 {t('market.setAlert')}</h3>
                  <span className="badge badge-warning">SMS / Push</span>
                </div>
                <form onSubmit={handleCreateAlert} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="e.g. 2650"
                    value={alertTargetPrice}
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary">
                    <FiBell /> {t('market.createAlertBtn')}
                  </button>
                </form>
                {alertSaved && (
                  <p style={{ color: 'var(--primary-600)', fontSize: '0.85rem', marginTop: '8px' }}>
                    ✅ Alert set for {selectedCrop} at ₹{alertTargetPrice}/Quintal!
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MarketPrices;
