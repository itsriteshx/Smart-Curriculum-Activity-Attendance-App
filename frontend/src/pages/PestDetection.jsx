import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { pestService } from '../services/api';
import SpeakButton from '../components/SpeakButton';
import {
  FiUploadCloud,
  FiCamera,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiDollarSign,
  FiX
} from 'react-icons/fi';

const PestDetection = () => {
  const { t, i18n } = useTranslation();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      const res = await pestService.getHistory();
      if (res?.data) {
        setHistory(res.data);
      }
    };
    loadHistory();

    return () => {
      stopCamera();
    };
  }, []);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Live Camera Snapshot
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Unable to access camera. Please check camera permissions or upload an image.');
      setCameraActive(false);
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImagePreview(dataUrl);

    // Convert dataUrl to blob
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setSelectedImage(file);
      });

    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleAnalyze = async () => {
    if (!selectedImage && !imagePreview) return;
    setAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const res = await pestService.detectImage(formData);
      if (res?.data?.detectedPest) {
        setResult(res.data.detectedPest);
      }
    } catch (err) {
      console.error('Pest diagnosis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          🛡️ {t('pest.title')}
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('pest.subtitle')}
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {/* Upload & Camera Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📷 Leaf Inspection Scanner</h3>
            <span className="badge badge-info">AI Computer Vision</span>
          </div>

          {/* Camera Viewfinder */}
          {cameraActive ? (
            <div style={{ position: 'relative', marginBottom: '16px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000' }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button type="button" className="btn btn-primary" onClick={captureSnapshot}>
                  📸 Snap Photo
                </button>
                <button type="button" className="btn btn-secondary" onClick={stopCamera}>
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Drag and Drop Zone */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-surface-raised)',
                marginBottom: '16px',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              <FiUploadCloud size={48} color="var(--primary-500)" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                {t('pest.dropzoneText')}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Supports JPG, PNG, WEBP up to 10MB
              </span>
            </div>
          )}

          {/* Buttons Row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1 }}
              onClick={startCamera}
            >
              <FiCamera /> {t('pest.cameraBtn')}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={(!selectedImage && !imagePreview) || analyzing}
              onClick={handleAnalyze}
            >
              {analyzing ? 'Diagnosing...' : '🔍 Analyze Leaf'}
            </button>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img
                src={imagePreview}
                alt="Selected Leaf Preview"
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
              />
              <button
                className="btn-icon"
                onClick={() => { setImagePreview(null); setSelectedImage(null); setResult(null); }}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white' }}
              >
                <FiX size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Diagnostic Results Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-header">
            <h3 className="card-title">🔬 {t('pest.detectedTitle')}</h3>
            {result && <span className="badge badge-success">{result.confidence}% Match</span>}
          </div>

          {analyzing && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2.5rem', animation: 'spin 2s linear infinite', marginBottom: '12px' }}>🌱</div>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                {t('pest.analyzing')}
              </p>
            </div>
          )}

          {!analyzing && !result && (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              <FiShield size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p>Upload or snap a photograph of the affected plant leaf to view instant treatment recommendations.</p>
            </div>
          )}

          {result && !analyzing && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)' }}>
                    {result.name}
                  </h4>
                  <span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    {result.scientificName}
                  </span>
                </div>
                <SpeakButton
                  textToRead={`${result.name}. Symptoms: ${i18n.language === 'hi' ? result.symptomsHi : result.symptoms}. Chemical remedy: ${result.chemicalTreatment?.remedy}. Organic remedy: ${result.organicTreatment?.remedy}.`}
                />
              </div>

              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-raised)', marginBottom: '16px', fontSize: '0.9rem' }}>
                <strong>{t('pest.symptoms')}:</strong>
                <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
                  {i18n.language === 'hi' ? result.symptomsHi : result.symptoms}
                </p>
              </div>

              {/* Remedies Grid */}
              <div className="grid-2" style={{ gap: '14px', marginBottom: '16px' }}>
                {/* Chemical Treatment */}
                <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--info)', display: 'block', marginBottom: '6px' }}>
                    💊 {t('pest.chemicalRemedy')}
                  </strong>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{result.chemicalTreatment?.remedy}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    Dosage: {result.chemicalTreatment?.dosage}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-700)', display: 'block', marginTop: '6px' }}>
                    Cost: ₹{result.chemicalTreatment?.estimatedCostPerAcre} / Acre
                  </span>
                </div>

                {/* Organic Treatment */}
                <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--primary-600)', display: 'block', marginBottom: '6px' }}>
                    🌿 {t('pest.organicRemedy')}
                  </strong>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{result.organicTreatment?.remedy}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    Dosage: {result.organicTreatment?.dosage}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-700)', display: 'block', marginTop: '6px' }}>
                    Cost: ₹{result.organicTreatment?.estimatedCostPerAcre} / Acre
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Historical Reports Footer */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              📋 {t('pest.recentHistory')}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '8px 12px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                  <span>{item.pestName} ({item.crop})</span>
                  <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCheckCircle size={12} /> Resolved
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestDetection;
