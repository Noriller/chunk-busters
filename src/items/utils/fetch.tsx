import { type BoardLights, makeOffBoard } from '@/components/board/useBoards';
import { parseAndToggleOnce } from './parseLine';
import { useSpeed } from '@/components/SpeedContext';
import { useCallback } from 'react';

/**
 * @param speedHack http max parallel connections is 6 for most modern browsers  
 * so, we hack here so make it feels like we are doing more requests  
 * remember: this is just a demo, will be a presentation...  
 * ...and going forward we will show this problem and why  
 * calling multiple times in parallel is a bad approach
 */
export const useFetchApi = (size?: number, speedHack = false) => {
  const { speed } = useSpeed();

  const getUrl = useCallback(
    (api: number) => {
      const delay = Math.floor(
        (typeof speed === 'function' ? speed() : speed) / (speedHack ? 2 : 1),
      );

      const url = new URL(
        `http://localhost/api/${api}/${size ?? ''}/${delay ?? ''}`,
      );
      return url.toString().replace(/\/+$/, '');
    },
    [speed, size],
  );

  return (api: number, signal: AbortSignal) =>
    fetch(getUrl(api), {
      signal,
    }).then((res) => res.text());
};

export const useMultiFetch = (
  setLights: React.Dispatch<React.SetStateAction<BoardLights>>,
  getMounted: () => boolean,
  size?: number,
) => {
  const getApi = useFetchApi(size);
  async function doMultiFetch(signal: AbortSignal, newSize = size) {
    if (!getMounted()) {
      return;
    }

    const fetch1 = await getApi(1, signal);
    parseAndToggleOnce(fetch1, setLights);

    const fetch2 = await getApi(2, signal);
    parseAndToggleOnce(fetch2, setLights);

    const fetch3 = await getApi(3, signal);
    parseAndToggleOnce(fetch3, setLights);

    const fetch4 = await getApi(4, signal);
    parseAndToggleOnce(fetch4, setLights);

    const fetch5 = await getApi(5, signal);
    parseAndToggleOnce(fetch5, setLights);

    const fetch6 = await getApi(6, signal);
    parseAndToggleOnce(fetch6, setLights);

    const fetch7 = await getApi(7, signal);
    parseAndToggleOnce(fetch7, setLights);

    const fetch8 = await getApi(8, signal);
    parseAndToggleOnce(fetch8, setLights);

    const fetch9 = await getApi(9, signal);
    parseAndToggleOnce(fetch9, setLights);

    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setLights(makeOffBoard());
      if (getMounted()) {
        doMultiFetch(signal, newSize);
      }
    }, 2000);
  }

  return doMultiFetch;
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
