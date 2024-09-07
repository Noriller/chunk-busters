import { useState, useEffect } from 'react';

const random = () => Math.random() > 0.5;

function makeLights<T = boolean>(
  // @ts-expect-error
  fn: () => T = random,
) {
  return Object.fromEntries(
    Array.from({ length: 9 }).map((_, i) => [i, fn()]),
  ) as Record<number, T>;
}

const randomIndex = () => Math.floor(Math.random() * 9);

export function useBoards() {
  const [lights, setLights] = useState(makeLights(makeLights));

  useEffect(() => {
    const interval = setInterval(() => {
      setLights((lights) => {
        lights[randomIndex()][randomIndex()] = random();
        return { ...lights };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return lights;
}
