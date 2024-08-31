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
    </div>
  );
}
