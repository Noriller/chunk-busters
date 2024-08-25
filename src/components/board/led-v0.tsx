'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function EnhancedLEDLights() {
  const [isOn, setIsOn] = useState(true);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4'>
      <div className='relative flex items-center space-x-12 mb-8'>
        <div className={`led-light green ${isOn ? 'on' : 'off'}`}></div>
        <div className={`led-light red ${isOn ? 'on' : 'off'}`}></div>
        {/* <div className={`blend-effect ${isOn ? 'on' : 'off'}`}></div> */}
      </div>
      <div className='flex items-center space-x-2'>
        <Switch
          id='power-mode'
          checked={isOn}
          onCheckedChange={setIsOn}
        />
        <Label
          htmlFor='power-mode'
          className='text-white'
        >
          Power {isOn ? 'On' : 'Off'}
        </Label>
      </div>
      <style>{`
        .led-light {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .led-light::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          // box-shadow: 0 0 20px 5px currentColor, 0 0 30px 10px currentColor,
          //   0 0 40px 15px rgba(255, 255, 255, 0.3);
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        .led-light::after {
          content: '';
          position: absolute;
          top: 15%;
          left: 15%;
          width: 30%;
          height: 30%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.2)
          );
          filter: blur(2px);
          transition: all 0.3s ease;
        }

        .led-light.on {
          animation: pulse 2s infinite alternate, flicker 0.1s infinite;
        }

        .green {
          background: radial-gradient(circle at 50% 50%, #00ff00, #006600);
          // box-shadow: 0 0 15px 5px rgba(0, 255, 0, 0.3),
          //   0 0 30px 10px rgba(0, 255, 0, 0.2),
          //   0 0 45px 15px rgba(0, 255, 0, 0.1);
          box-shadow: 0 0 60px 10px rgba(0, 255, 0, 0.3),
            0 0 100px 30px rgba(0, 255, 0, 0.2),
            0 0 150px 60px rgba(0, 255, 0, 0.1);
        }

        .red {
          background: radial-gradient(circle at 50% 50%, #ff0000, #660000);
          box-shadow: 0 0 60px 10px rgba(255, 0, 9, 0.3),
            0 0 100px 30px rgba(255, 0, 9, 0.2),
            0 0 150px 60px rgba(255, 0, 9, 0.1);
          // box-shadow: 0 0 15px 5px rgba(255, 0, 0, 0.3),
          //   0 0 30px 10px rgba(255, 0, 0, 0.2),
          //   0 0 45px 15px rgba(255, 0, 0, 0.1);
        }

        .blend-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 100px;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 0, 0.2) 0%,
            rgba(255, 255, 0, 0) 70%
          );
          filter: blur(10px);
          z-index: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .blend-effect.on {
          opacity: 1;
          animation: blend-pulse 4s infinite alternate;
        }

        .led-light.off {
          background: #333;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
        }

        .led-light.off::before,
        .led-light.off::after {
          opacity: 0;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          }
        }

        @keyframes flicker {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.98;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes blend-pulse {
          0% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
