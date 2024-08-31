import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import EnhancedLEDLights from './components/board/led-v0';
import { Led } from './components/board/led';
import { Board } from './components/board';

// function App() {
//   return (
//     <div className='w-screen h-screen flex items-center justify-center overflow-hidden'>
//       <div
//         className={`min-h-[70vh] min-w-[70vh] h-[80vh] w-[80vh] max-h-[90vh] max-w-[90vh]
//           bg-wood grid grid-cols-3 grid-rows-3 gap-4 p-8
//           text-[1px]
//         `}
//       >
//         {Array.from({ length: 9 }, (_, i) => (
//           <Board
//             key={i}
//             index={i * 2}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

function App() {
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-gray-900 p-4'>
      <div className='w-full max-w-[90vmin] max-h-[90vmin] aspect-square rainbow-shadow relative z-0'>
        <Board />
      </div>
    </div>
  );
}

export default App;
