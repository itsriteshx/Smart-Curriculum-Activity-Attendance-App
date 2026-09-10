import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cropService } from '../services/api';
import SpeakButton from '../components/SpeakButton';
import {
  FiFilter,
  FiBookmark,
  FiTrendingUp,
  FiDroplet,
  FiClock,
  FiCheck,
  FiInfo,
  FiX
} from 'react-icons/fi';

const CropRecommendations = () => {
  const { t } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [sortBy, setSortBy] = useState('profit');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    const loadCrops = async () => {
      const res = await cropService.getRecommendations();
      if (res?.data) {
        setCrops(res.data);
        setFilteredCrops(res.data);
      }
    };
    loadCrops();
  }, []);

  useEffect(() => {
    let result = [...crops];

    if (seasonFilter !== 'all') {
      result = result.filter(c => c.season.toLowerCase() === seasonFilter.toLowerCase());
    }

    if (sortBy === 'profit') {
      result.sort((a, b) => (b.estimatedProfit || 0) - (a.estimatedProfit || 0));
    } else if (sortBy === 'match') {
      result.sort((a, b) => (b.suitabilityScore || 0) - (a.suitabilityScore || 0));
    } else if (sortBy === 'cost') {
      result.sort((a, b) => (a.costPerAcre || 0) - (b.costPerAcre || 0));
    }

    setFilteredCrops(result);
  }, [crops, seasonFilter, sortBy]);

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          🌾 {t('crops.title')}
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('crops.subtitle')}
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FiFilter /> {t('crops.filterSeason')}:
          </span>
          {['all', 'Kharif', 'Rabi', 'Zaid'].map((season) => (
            <button
              key={season}
              type="button"
              className={`btn ${seasonFilter === season ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              onClick={() => setSeasonFilter(season)}
            >
              {season === 'all' ? t('crops.all') : season}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sort By:</span>
          <select
            className="form-select"
            style={{ padding: '6px 12px', width: 'auto', fontSize: '0.85rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="profit">Highest Profit (₹/Acre)</option>
            <option value="match">Suitability Match Score</option>
            <option value="cost">Lowest Cultivation Cost</option>
          </select>
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid-2">
        {filteredCrops.map((crop) => {
          const isBookmarked = bookmarkedIds.includes(crop._id);
          const ttsText = `${crop.name}, variety ${crop.variety}. Suitability match ${crop.suitabilityScore} percent. Expected profit ${crop.estimatedProfit} rupees per acre. Expected yield ${crop.expectedYield}.`;

          return (
            <div key={crop._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-success">{crop.season} Season</span>
                      <span className="badge badge-info">{crop.suitabilityScore}% Match</span>
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{crop.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Variety: {crop.variety}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-icon"
                      onClick={() => toggleBookmark(crop._id)}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      style={{ color: isBookmarked ? 'var(--accent-500)' : 'var(--text-muted)' }}
                    >
                      <FiBookmark />
                    </button>
                    <SpeakButton textToRead={ttsText} label={t('crops.listen')} />
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid-3" style={{ background: 'var(--bg-surface-raised)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '16px', textAlign: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                      {t('crops.expectedYield')}
                    </span>
                    <strong style={{ fontSize: '0.9rem' }}>{crop.expectedYield}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                      {t('crops.costPerAcre')}
                    </span>
                    <strong style={{ fontSize: '0.9rem' }}>₹{crop.costPerAcre?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                      Est. Profit / Acre
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary-600)' }}>
                      ₹{crop.estimatedProfit?.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiDroplet color="var(--info)" /> Water Need: <strong>{crop.waterRequirement}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiClock color="var(--primary-500)" /> Crop Cycle: <strong>{crop.durationDays} Days</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiTrendingUp color="var(--accent-500)" /> Market Demand: <strong>{crop.marketDemand}</strong>
                  </span>
                </div>

                {/* Why Suitable List */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {t('crops.whySuitable')}
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {crop.factors?.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiCheck color="var(--primary-500)" size={14} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                  onClick={() => setSelectedCrop(crop)}
                >
                  <FiInfo /> {t('crops.viewDetails')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Crop Guide Modal */}
      {selectedCrop && (
        <div className="sidebar-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card fade-in" style={{ maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header" style={{ marginBottom: '14px' }}>
              <div>
                <h3 className="card-title">📖 {selectedCrop.name} Agronomic Guide</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedCrop.variety}</span>
              </div>
              <button className="btn-icon" onClick={() => setSelectedCrop(null)}>
                <FiX />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <div style={{ padding: '12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)' }}>
                <strong>Sowing Season & Climate</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Best sown in {selectedCrop.season} with temperatures between 20°C - 30°C. Requires well-drained {selectedCrop.soilCompatibility?.join(' or ')} soil.
                </p>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)' }}>
                <strong>Water & Irrigation Schedule</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {selectedCrop.waterRequirement}. Critical irrigation stages: Crown root initiation, tillering, and grain development.
                </p>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)' }}>
                <strong>Estimated Economics (Per Acre)</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Cost: ₹{selectedCrop.costPerAcre?.toLocaleString('en-IN')} | Revenue: ₹{((selectedCrop.costPerAcre || 0) + (selectedCrop.estimatedProfit || 0)).toLocaleString('en-IN')} | Net Profit: ₹{selectedCrop.estimatedProfit?.toLocaleString('en-IN')}
                </p>
              </div>

              <button className="btn btn-primary" onClick={() => setSelectedCrop(null)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropRecommendations;
