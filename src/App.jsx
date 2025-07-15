import React, { useState } from 'react';
import SolarSystem from './components/SolarSystem';
import SpeedControlPanel from './components/SpeedControlPanel';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [resetCameraFlag, setResetCameraFlag] = useState(false);
  const [speeds, setSpeeds] = useState({
    mercury: 3,    
    venus: 3.5,     
    earth: 2.5,    
    mars: 2,     
    jupiter: 4,  
    saturn: 4.5,    
    uranus: 5,    
    neptune: 6,   
  });
  const [showSpeedPanel, setShowSpeedPanel] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const togglePause = () => setIsPaused((prev) => !prev);
  const resetCamera = () => setResetCameraFlag((prev) => !prev);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-gray-100 to-blue-200 transition-colors duration-300">
      {/* Control Buttons */}
      <div className="absolute top-12 left-12 md:top-16 md:left-16 flex gap-3 z-50">
        <button
          onClick={togglePause}
          className={`px-5 py-2.5 rounded-xl border-2 font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 ${!darkMode ? 'focus:ring-blue-500/40 bg-gray-900 text-gray-200 border-blue-500 hover:bg-blue-800 hover:border-blue-400' : 'focus:ring-blue-400/60 bg-blue-50 text-blue-900 border-blue-400 hover:bg-blue-200 hover:border-blue-600'} transform hover:scale-105 hover:brightness-110`}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={resetCamera}
          className={`px-5 py-2.5 rounded-xl border-2 font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 ${!darkMode ? 'focus:ring-indigo-500/40 bg-gray-900 text-white border-indigo-500 hover:bg-indigo-800 hover:border-indigo-400' : 'focus:ring-indigo-400/60 bg-indigo-50 text-indigo-900 border-indigo-400 hover:bg-indigo-200 hover:border-indigo-600'} transform hover:scale-105 hover:brightness-110`}
        >
          Reset Camera
        </button>
        <button
          onClick={toggleDarkMode}
          className={`px-5 py-2.5 rounded-xl border-2 font-bold shadow-lg transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-4 ${!darkMode ? 'focus:ring-yellow-500/40 bg-yellow-600 text-white border-yellow-400 hover:bg-yellow-500 hover:border-yellow-300' : 'focus:ring-yellow-400/60 bg-yellow-100 text-yellow-900 border-yellow-400 hover:bg-yellow-200 hover:border-yellow-600'} transform hover:scale-105 hover:brightness-110`}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Centered Header */}
      <div className="w-full flex flex-col items-center pt-8 mb-8 z-50 relative">
        <h1 className="app-header header-animate header-shadow text-4xl md:text-5xl font-extrabold text-white text-center">
          3D Solar System
        </h1>
      </div>

      {/* Speed Control Panel Toggle Button (when closed) */}
      {!showSpeedPanel && (
        <button
          onClick={() => setShowSpeedPanel(true)}
          className={`fixed bottom-12 right-12 md:bottom-16 md:right-16 z-50 p-3 rounded-full shadow-lg border-2 transition-all duration-200
            ${darkMode ? 'bg-white text-black border-gray-200 hover:bg-gray-100' : 'bg-black text-white border-gray-700 hover:bg-gray-800'}`}
          aria-label="Open Speed Controls"
        >
          {/* Menu Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      {/* Speed Control Panel */}
      {showSpeedPanel && (
        <div className="fixed bottom-12 right-12 md:bottom-16 md:right-16 z-40 flex flex-col items-end">
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => {
                console.log('Close button clicked');
                setShowSpeedPanel(false);
              }}
              className={`absolute -top-4 -right-4 p-2 rounded-full shadow border-2 z-50 transition-all duration-200 pointer-events-auto
                ${darkMode ? 'bg-white text-black border-gray-200 hover:bg-gray-100' : 'bg-black text-white border-gray-700 hover:bg-gray-800'}`}
              aria-label="Close Speed Controls"
            >
              {/* X Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="glass-panel w-96 max-w-full p-8 flex flex-col gap-4 items-stretch">
              <SpeedControlPanel
                speeds={speeds}
                setSpeeds={setSpeeds}
                isPaused={isPaused}
                togglePause={togglePause}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      )}

      {/* Canvas 3D Scene */}
      <div className="fixed inset-0 w-screen h-screen z-0">
        <SolarSystem
          speeds={isPaused ? {} : speeds}
          setSpeeds={setSpeeds}
          isPaused={isPaused}
          resetCameraFlag={resetCameraFlag}
          darkMode={true}
        />
      </div>
    </div>
  );
}

export default App;
