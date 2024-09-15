import { useState, useEffect, useCallback } from 'react';

type Indexes = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const random = () => Math.random() > 0.5;

function makeLights<T = boolean>(fn?: () => T): Record<Indexes, T>;
function makeLights(fn = random) {
  return Object.fromEntries(
    Array.from({ length: 9 }).map((_, i) => [i as Indexes, fn()]),
  );
}

const randomIndex = () => Math.floor(Math.random() * 9) as Indexes;

export function useBoards() {
  const { lights, toggle } = useLights(makeLights(makeLights));

  useEffect(() => {
    const interval = setInterval(() => {
      toggle(randomIndex(), randomIndex(), random());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return lights;
}

function useLights(init: Record<Indexes, Record<Indexes, boolean>>) {
  const [lights, setLights] = useState(init);

  const toggle = useCallback((board: Indexes, light: Indexes, on?: boolean) => {
    if (
      board === undefined ||
      light === undefined ||
      board < 0 ||
      board > 8 ||
      light < 0 ||
      light > 8
    ) {
      return;
    }

    return setLights((lights) => {
      lights[board][light] = on ?? !lights[board][light];
      return { ...lights };
    });
  }, []);

  return { lights, toggle };
}
