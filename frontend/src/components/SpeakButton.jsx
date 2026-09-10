import React from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useSpeech } from '../hooks/useSpeech';

const SpeakButton = ({ textToRead, label = 'Listen' }) => {
  const { isSpeaking, speak, stopSpeaking } = useSpeech();

  const handleSpeakClick = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(textToRead);
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-outline ${isSpeaking ? 'voice-active-pulse' : ''}`}
      onClick={handleSpeakClick}
      title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
    >
      {isSpeaking ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
      <span>{label}</span>
    </button>
  );
};

export default SpeakButton;
