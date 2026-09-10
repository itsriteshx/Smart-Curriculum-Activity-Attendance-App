import React from 'react';
import WeatherWidget from './WeatherWidget';

const WeatherCard = ({ weather }) => {
  return <WeatherWidget weather={weather} />;
};

export default WeatherCard;
