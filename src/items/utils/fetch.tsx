import { useSpeed } from '@/components/SpeedContext';
import { useCallback } from 'react';
import { parseToggleAndRemaining, type SetLights } from './parseLine';
import { useSize } from '@/components/SizeContext';

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

      const url = new URL(
        `http://localhost/api/${api}/${size ?? ''}/${delay ?? ''}`,
      );
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

  const getUrl = useCallback(
    (api: number) => {
      const delay = typeof speed === 'function' ? speed() : speed;
      const size = typeof baseSize === 'function' ? baseSize() : baseSize;

      const url = new URL(
        `http://localhost/api/${api}/${size ?? ''}/${delay ?? ''}`,
      );
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
