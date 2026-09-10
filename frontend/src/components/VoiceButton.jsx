import React from 'react';
import { FiMic } from 'react-icons/fi';
import { useSpeech } from '../hooks/useSpeech';

const VoiceButton = ({ onTranscript, title = 'Speak to search' }) => {
  const { isListening, listen } = useSpeech();

  const handleListenClick = () => {
    listen((resultText) => {
      if (onTranscript) {
        onTranscript(resultText);
      }
    });
  };

  return (
    <button
      type="button"
      className={`btn-icon ${isListening ? 'voice-active-pulse' : ''}`}
      onClick={handleListenClick}
      title={isListening ? 'Listening... speak now' : title}
      aria-label={title}
    >
      <FiMic size={18} />
    </button>
  );
};

export default VoiceButton;
