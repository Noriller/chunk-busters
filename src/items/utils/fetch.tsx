import { useProgress } from '@/components/ProgressContext';
import { useSize } from '@/components/SizeContext';
import { useSpeed } from '@/components/SpeedContext';
import { useCallback } from 'react';
import { parseToggleAndRemaining, type SetLights } from './parseLine';

const { getCount, increment, reset } = boardCounter();

const BASE_URL = (api: number) => `http://localhost/api/${api}`;
// yes, you can call different ports and for http/1 you can
// have it work in parallel, even all 9 at once
// but thats a kludge that is not really scalable
// and as you'll see... there's better ways to solve this
// const BASE_URL = (api: number) => `http://localhost:5888${api}/${api}`;;

/**
 * @param speedHack http max parallel connections is 6 for most modern browsers
 * so, we hack here so make it feels like we are doing more requests
 * remember: this is just a demo, will be a presentation...
 * ...and going forward we will show this problem and why
 * calling multiple times in parallel is a bad approach
 */
export const useFetchApi = (speedHack = false) => {
  const { speed } = useSpeed();
  const { size: baseSize } = useSize();

  const getUrl = useCallback(
    (api: number) => {
      const delay = Math.floor(
        (typeof speed === 'function' ? speed() : speed) / (speedHack ? 2 : 1),
      );
      const size = typeof baseSize === 'function' ? baseSize() : baseSize;

      const url = new URL(`${BASE_URL(api)}/${size ?? ''}/${delay ?? ''}`);
      return url.toString().replace(/\/+$/, '');
    },
    [speed, baseSize],
  );

  return (api: number, signal: AbortSignal) =>
    fetch(getUrl(api), {
      signal,
    }).then((res) => res.text());
};

export const useStreamFetchApi = (setLights: SetLights) => {
  const { speed } = useSpeed();
  const { size: baseSize } = useSize();
  const { changeMax, changeCurrent } = useProgress();

  const changeBoardCurrent = (index: number) => {
    increment(index);
    changeCurrent(index, getCount(index));
  };

  const getUrl = useCallback(
    (api: number) => {
      const delay = typeof speed === 'function' ? speed() : speed;
      const size = typeof baseSize === 'function' ? baseSize() : baseSize;
      changeMax(api, size);
      reset(api === 0 ? undefined : api);

      const url = new URL(`${BASE_URL(api)}/${size ?? ''}/${delay ?? ''}`);
      return url.toString().replace(/\/+$/, '');
    },
    [speed, baseSize],
  );

  const decoder = new TextDecoder('utf-8');

  return (api: number, signal: AbortSignal) =>
    fetch(getUrl(api), {
      signal,
    }).then(async (res) => {
      const reader = res.body?.getReader();
      if (!reader) {
        return;
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done || signal.aborted) {
          reader.cancel(signal.reason);
          break;
        }

        if (value) {
          buffer = parseToggleAndRemaining(
            buffer + decoder.decode(value),
            setLights,
            changeBoardCurrent,
          );
        }
      }
    });
};

/**
 * this is a bit of a hack to get it to run the example
 * this allows for it to run in a loop and stop after leaving
 */
export function mountedHack() {
  let mounted = true;
  const getMounted = () => mounted;
  const setMounted = (val: boolean) => {
    mounted = val;
  };

  return {
    getMounted,
    setMounted,
  };
}

export function boardCounter() {
  const resetCount = () =>
    Object.fromEntries(
      Array.from({ length: 9 }, (_, i) => [i + 1, 0]),
    ) as Record<number, number>;

  let count = resetCount();
  return {
    getCount: (i: number) => count[i],
    increment: (i: number, n?: number) => {
      count[i] += n ?? 1;
    },
    reset: (n?: number) => {
      if (n) {
        count[n] = 0;
        return;
      }

      count = resetCount();
    },
  };
}
