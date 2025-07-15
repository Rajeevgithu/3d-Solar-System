import React from 'react';

const planetColors = {
  mercury: '#b1b1b1',
  venus: '#e6c07b',
  earth: '#3a7bd5',
  mars: '#c1440e',
  jupiter: '#e3c07b',
  saturn: '#e7d3a1',
  uranus: '#7de2fc',
  neptune: '#4062bb',
  pluto: '#d3d3d3',
};

const SpeedControlPanel = ({ speeds, setSpeeds, isPaused, togglePause, darkMode }) => {
  // Real rotation speeds in km/h for each planet
  const planetRotationSpeeds = {
    mercury: 3.83,
    venus: 2.52,
    earth: 3.2,
    mars: 3.66,
    jupiter: 3.07,
    saturn: 2.4,
    uranus: 1.2,
    neptune: 1.2,
  };
  const handleSpeedChange = (planet, value) => {
    setSpeeds((prev) => ({ ...prev, [planet]: parseFloat(value) }));
  };

  return (
    <div
      className={`rounded-2xl shadow-2xl p-8 w-96 font-sans transition-colors duration-300 flex flex-col gap-4 items-stretch
        border ${darkMode ? 'border-gray-200 bg-white' : 'border-gray-700 bg-black'}`}
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
    >
      <h2 className={`text-2xl font-extrabold mb-4 tracking-wide drop-shadow text-center ${darkMode ? 'text-black' : 'text-white'}`}>
        Speed Controls
      </h2>
      <div className="flex flex-col gap-3">
        {Object.keys(speeds).filter(planet => planetRotationSpeeds[planet] !== undefined).map((planet) => (
          <div key={planet} className="flex items-center gap-4">
            <span className={`inline-block w-5 h-5 rounded-full border-2 ${darkMode ? 'border-black' : 'border-gray-800'}`} style={{ background: planetColors[planet] }}></span>
            <label className={`capitalize font-semibold w-24 text-lg ${darkMode ? 'text-black' : 'text-white'}`}>
              {planet}  
            </label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.01"
              value={speeds[planet]}
              onChange={(e) => handleSpeedChange(planet, e.target.value)}
              className={`w-full accent-blue-500 rounded-lg h-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? 'bg-gray-200' : 'bg-gray-800'}`}
            />
            <span className={`ml-2 text-xs font-mono ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>
              {speeds[planet]?.toLocaleString(undefined, { maximumFractionDigits: 2 })} km/h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeedControlPanel; 