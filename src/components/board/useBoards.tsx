import { mountedHack } from '@/items/utils/fetch';
import type { SetLights } from '@/items/utils/parseLine';
import { useCallback, useEffect, useState } from 'react';
import { useSize } from '../SizeContext';
import { useSpeed } from '../SpeedContext';

export type Indexes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const random = () => Math.random() > 0.5;

function makeLights<T = boolean>(fn?: () => T): Record<Indexes, T>;
function makeLights(fn = random) {
  return Object.fromEntries(
    Array.from({ length: 9 }).map((_, i) => [(i + 1) as Indexes, fn()]),
  );
}

// this calls makeLights() that will call makeLights() again for each index
// the first create 9 "boards", the second 81 "lights" (9 per board)
const makeRandomBoard = (): BoardLights => makeLights(makeLights);
// this calls makeLights() that will create 9 boards
// but then again, but this time it will call with all "off" for each board
export function makeOffBoard(): BoardLights {
  return makeLights(() => makeLights(() => false));
}

const randomIndex = () => Math.floor(Math.random() * 10) as Indexes;

/**
 * This hook will create a board with random lights
 * and toggle one of them every 100ms
 *
 * to be used as a placeholder
 */
export function useRandomBoards() {
  const { lights, toggle } = useLights(makeRandomBoard());

  useEffect(() => {
    const interval = setInterval(() => {
      toggle(randomIndex(), randomIndex(), random());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return lights;
}

const { getMounted, setMounted } = mountedHack();

/**
 * this is a HOC for the hook that will set the board lights
 * this controls the lights state and if it should abort the fetches
 */
export function makeBoardHook(
  createAsyncFunc: (
    setLights: SetLights,
    getMountedHack: typeof getMounted,
  ) => (signal: AbortSignal) => Promise<void>,
) {
  return () => {
    const [lights, setLights] = useState(makeOffBoard());
    const { speed } = useSpeed();
    const { size } = useSize();

    const asyncFunc = createAsyncFunc(setLights, getMounted);

    useEffect(() => {
      setMounted(true);
      const controller = new AbortController();

      asyncFunc(controller.signal).catch(() => {
        /**
         * intentionally blank
         *
         * not going to handle errors in this demo
         */
      });

      return () => {
        setMounted(false);
        controller.abort('unmount');
      };
    }, [speed, size]);

    return lights;
  };
}

export function isIndexValid(val: number): val is Indexes {
  return val !== undefined && val > 0 && val <= 9;
}

export type BoardLights = Record<Indexes, Record<Indexes, boolean>>;

export function useLights(init: BoardLights) {
  const [lights, setLights] = useState(init);

  const toggle = useCallback((board: number, light: number, on?: boolean) => {
    if (!isIndexValid(board) || !isIndexValid(light)) {
      return;
    }

    return setLights((lights) => {
      // accept the boolean or invert the current value
      lights[board][light] = on ?? !lights[board][light];
      return {
        ...lights,
        [board]: { ...lights[board] },
      };
    });
  }, []);

  return { lights, toggle };
}
