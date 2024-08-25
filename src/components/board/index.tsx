import { useEffect, useState } from 'react';
import { Led } from './led';

export function Board({ index = 0 }: { index?: number }) {
  const random = () => Math.random() > 0.5;
  const makeLights = () => Array.from({ length: 9 }, random);
  const [lights, setLights] = useState(makeLights());

  const randomIndex = () => Math.floor(Math.random() * 9);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = randomIndex();
      setLights((lights) => {
        lights[index] = !lights[index];
        return [...lights];
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <InnerBoard index={index}>
      {lights.map((on, i) => (
        <Led
          key={i}
          on={on}
        />
      ))}
    </InnerBoard>
  );
}

function InnerBoard({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <div className='relative w-64 h-64 p-10'>
      <div className='absolute inset-2 z-10 '>
        <div
          style={{
            // @ts-ignore
            '--time': `${index + 20}s`,
          }}
          className={`relative rainbow-shadow rounded-lg
                      text-[8px] bg-wood w-full h-full p-6
                      grid gap-8 grid-cols-3 grid-rows-3`}
        >
          {children}
        </div>
      </div>
      {/* @ts-ignore */}
      <style jsx>{`
        .rainbow-shadow {
          background: linear-gradient(0deg, #000, #262626);
          &:before,
          &:after {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            width: calc(100% + 4px);
            height: calc(100% + 4px);
            background: linear-gradient(
              45deg,
              #fb0094,
              #0000ff,
              #00ff00,
              #ffff00,
              #ff0000,
              #fb0094,
              #0000ff,
              #00ff00,
              #ffff00,
              #ff0000
            );
            background-size: 400%;
            z-index: -1;
            border-radius: var(--radius);
            animation: shadow var(--time) linear infinite;
          }

          &:after {
            top: -8px;
            left: -8px;
            width: calc(100% + 16px);
            height: calc(100% + 16px);
            filter: blur(24px);
            opacity: 0.9;
          }
        }

        @keyframes shadow {
          0% {
            background-position: 0 0;
          }
          50% {
            background-position: 200% 0;
          }
          100% {
            background-position: 0 0;
          }
        }

        .bg-wood {
          background-image: repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.1) 0px,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px,
              transparent 15px
            ),
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.1) 0px,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px,
              transparent 15px
            ),
            linear-gradient(45deg, #4a3520, #6b4d30);
        }
      `}</style>
    </div>
  );
}
