import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import EnhancedLEDLights from './components/board/led-v0';
import { Led } from './components/board/led';
import { Board } from './components/board';

function App() {
  return (
    <div className='w-screen h-screen bg-black grid grid-cols-3 grid-rows-3 gap-4 p-4'>
      {Array.from({ length: 9 }, (_, i) => (
        <Board
          key={i}
          index={i * 2}
        />
      ))}
    </div>
  );
}

export default App;
