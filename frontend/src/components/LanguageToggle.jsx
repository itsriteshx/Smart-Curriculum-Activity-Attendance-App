import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('kisan_lang', next);
  };

  return (
    <button className="btn btn-outline" onClick={toggle}>
      <FiGlobe /> {i18n.language === 'en' ? 'हिन्दी' : 'English'}
    </button>
  );
};

export default LanguageToggle;
