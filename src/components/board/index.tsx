import { useEffect, useState } from 'react';
import { Led } from './led';

export function Board() {
  return (
    <div className="bg-wood grid h-full w-full grid-cols-3 grid-rows-3 gap-[2%] rounded-lg p-[2%]">
      {Array.from({ length: 9 }, (_, i) => (
        <MiniBoard key={i} />
      ))}
    </div>
  );
}

function MiniBoard() {
  const random = () => Math.random() > 0.5;
  const makeLights = () => Array.from({ length: 9 }, random);
  const [lights, setLights] = useState(makeLights());

  const randomIndex = () => Math.floor(Math.random() * 9);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = randomIndex();
      setLights((lights) => {
        const newLights = [...lights];
        newLights[index] = !newLights[index];
        return newLights;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-circuit h-full w-full rounded-lg p-[4%]">
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-[10%]">
        {lights.map((on, i) => (
          <Led key={i} on={on} />
        ))}
      </div>
    </div>
  );
}
