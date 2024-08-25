import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import EnhancedLEDLights from './led';

function App() {
  return (
    <div className='relative flex items-center space-x-12 mb-8'>
      <div className='led-light green on'></div>
      <div className='led-light red on'></div>
    </div>
  );
}

export default App;
