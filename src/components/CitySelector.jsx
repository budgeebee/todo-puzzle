import React, { useState } from 'react';
import './CitySelector.css';

const POPULAR_CITIES = [
  'Paris', 'Tokyo', 'New York', 'London', 'Barcelona',
  'Sydney', 'Rome', 'Dubai', 'Singapore', 'San Francisco',
  'Berlin', 'Amsterdam', 'Hong Kong', 'Rio de Janeiro', 'Cairo',
  'Mumbai', 'Toronto', 'Chicago', 'Los Angeles', 'Miami'
];

function CitySelector({ onSelect }) {
  const [customCity, setCustomCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCityClick = async (city) => {
    setIsLoading(true);
    await onSelect(city);
    setIsLoading(false);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (customCity.trim()) {
      setIsLoading(true);
      await onSelect(customCity.trim());
      setIsLoading(false);
      setCustomCity('');
    }
  };

  return (
    <div className="city-selector">
      <h2>Choose a City</h2>
      <p className="subtitle">Select a city to reveal its skyline as you complete todos</p>
      
      <div className="city-grid">
        {POPULAR_CITIES.map(city => (
          <button
            key={city}
            className="city-btn"
            onClick={() => handleCityClick(city)}
            disabled={isLoading}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="divider">
        <span>or</span>
      </div>

      <form onSubmit={handleCustomSubmit} className="custom-city-form">
        <input
          type="text"
          placeholder="Enter any city..."
          value={customCity}
          onChange={(e) => setCustomCity(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !customCity.trim()}>
          {isLoading ? 'Loading...' : 'Go'}
        </button>
      </form>
    </div>
  );
}

export default CitySelector;
