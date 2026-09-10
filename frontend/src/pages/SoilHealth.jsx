import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { soilService } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FiActivity, FiCalendar, FiCheck, FiInfo } from 'react-icons/fi';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SoilHealth = () => {
  const { t, i18n } = useTranslation();
  const [soilData, setSoilData] = useState(null);
  const [farmAcres, setFarmAcres] = useState(4.0);
  const [fertPlan, setFertPlan] = useState(null);
  const [reminderDate, setReminderDate] = useState('2027-02-15');
  const [reminderSuccess, setReminderSuccess] = useState(false);

  useEffect(() => {
    const loadDiagnostics = async () => {
      const res = await soilService.getDiagnostics();
      if (res?.data) {
        setSoilData(res.data);
      }
    };
    loadDiagnostics();
  }, []);

  useEffect(() => {
    if (farmAcres > 0) {
      const plan = soilService.calculateFertilizer(farmAcres);
      setFertPlan(plan);
    }
  }, [farmAcres]);

  const handleSetReminder = async () => {
    await soilService.setReminder('demo', reminderDate);
    setReminderSuccess(true);
    setTimeout(() => setReminderSuccess(false), 4000);
  };

  // Historical NPK Chart Data
  const chartData = {
    labels: soilData?.history?.map(h => h.date) || ['Nov 2024', 'May 2025', 'Aug 2026'],
    datasets: [
      {
        label: 'Nitrogen (kg/ha)',
        data: soilData?.history?.map(h => h.n) || [160, 175, 185],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Phosphorus (kg/ha)',
        data: soilData?.history?.map(h => h.p) || [28, 30, 34],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Potassium (kg/ha)',
        data: soilData?.history?.map(h => h.k) || [210, 225, 240],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Inter', size: 12 } },
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
          🧪 {t('soil.title')}
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('soil.subtitle')}
        </p>
      </div>

      {/* Soil NPK & pH Diagnostic Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ borderLeft: '5px solid #ef4444' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('soil.nitrogen')}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>185</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>kg/ha</span>
          </div>
          <span className="badge badge-danger">Low (Deficient)</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
            Target: 280-560 kg/ha
          </span>
        </div>

        <div className="card" style={{ borderLeft: '5px solid #f59e0b' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('soil.phosphorus')}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>34</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>kg/ha</span>
          </div>
          <span className="badge badge-warning">Medium</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
            Target: 23-56 kg/ha
          </span>
        </div>

        <div className="card" style={{ borderLeft: '5px solid #10b981' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('soil.potassium')}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>240</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>kg/ha</span>
          </div>
          <span className="badge badge-success">Optimal</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
            Target: &gt; 280 kg/ha
          </span>
        </div>

        <div className="card" style={{ borderLeft: '5px solid #3b82f6' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('soil.ph')}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>6.8</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>pH scale</span>
          </div>
          <span className="badge badge-info">Neutral (Ideal)</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
            Target: 6.5 - 7.5
          </span>
        </div>
      </div>

      {/* Main Two Columns: Calculator & Chart */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {/* Fertilizer Calculator */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🧮 {t('soil.calcTitle')}</h3>
            <span className="badge badge-success">Precision Agronomy</span>
          </div>

          <div className="form-group">
            <label className="form-label">{t('soil.farmSizeLabel')}</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="100"
              className="form-input"
              value={farmAcres}
              onChange={(e) => setFarmAcres(parseFloat(e.target.value) || 1)}
            />
          </div>

          {fertPlan && (
            <div>
              <div className="grid-3" style={{ background: 'var(--bg-surface-raised)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', textAlign: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {t('soil.ureaBags')}
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                    {fertPlan.ureaBags}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    ₹{fertPlan.ureaCost} (@ ₹270)
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {t('soil.dapBags')}
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>
                    {fertPlan.dapBags}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    ₹{fertPlan.dapCost} (@ ₹1350)
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {t('soil.mopBags')}
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--info)' }}>
                    {fertPlan.mopBags}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    ₹{fertPlan.mopCost} (@ ₹1700)
                  </span>
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <strong style={{ fontSize: '1rem' }}>{t('soil.totalCost')}:</strong>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                  ₹{fertPlan.totalCost?.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Application Stages Schedule */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  📅 Scientific Application Schedule:
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {(i18n.language === 'hi' ? fertPlan.scheduleHi : fertPlan.schedule)?.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <FiCheck color="var(--primary-500)" style={{ marginTop: '3px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Historical Soil Trend Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-header">
            <h3 className="card-title">📈 {t('soil.trendTitle')}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>3-Year Laboratory History</span>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Testing Reminder Scheduler */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              ⏰ {t('soil.setReminder')}
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="date"
                className="form-input"
                style={{ width: 'auto', flex: 1 }}
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSetReminder}
              >
                <FiCalendar /> Save
              </button>
            </div>
            {reminderSuccess && (
              <p style={{ color: 'var(--primary-600)', fontSize: '0.85rem', marginTop: '6px' }}>
                ✅ {t('soil.reminderSet')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilHealth;
