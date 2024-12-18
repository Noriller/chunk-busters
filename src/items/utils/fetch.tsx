import { useProgress } from '@/components/ProgressContext';
import { useSize } from '@/components/SizeContext';
import { useSpeed } from '@/components/SpeedContext';
import { useCallback } from 'react';
import {
  parseProgressAndRemaining,
  parseToggleAndRemaining,
  type SetLights,
} from './parseLine';

const decoder = new TextDecoder('utf-8');

// yes, you can call different ports and for http/1 you can
// have it work in parallel, even all 9 at once
// but thats a kludge that is not really scalable
// and as you'll see... there's better ways to solve this
const BASE_URL = (api: number) => `http://${window.location.host}/api/${api}`;
// but changing to this one would "fix" the http/1 problem
// const BASE_URL = (api: number) => `http://localhost:5888${api}/${api}`;

/**
 * The "normal" fetch function that awaits
 * the data and then return something
 *
 * @param speedHack http max parallel connections is 6 for most modern browsers
 * so, we hack here so make it feels like we are doing more requests
 * remember: this is just a demo, will be a presentation...
 * ...and going forward we will show this problem and why
 * calling multiple times in parallel is a bad approach
 */
export const useFetchApi = (speedHack = false) => {
  const { getCount, increment, reset } = boardCounter();
  const { speed } = useSpeed();
  const { size: baseSize } = useSize();
  const { changeMax, changeCurrent } = useProgress();

  const changeBoardCurrent = (index: number, by?: number) => {
    increment(index, by);
    changeCurrent(index, getCount(index));
  };

  const getUrl = useCallback(
    (api: number) => {
      const delay = Math.floor(
        // chaotic gives random values generated by the function
        // also, if speedhack, we divide value by 2
        (typeof speed === 'function' ? speed() : speed) / (speedHack ? 2 : 1),
      );

      // chaotic gives random values generated by the function
      const size = typeof baseSize === 'function' ? baseSize() : baseSize;

      changeMax(api, size);

      const url = new URL(`${BASE_URL(api)}/${size ?? ''}/${delay ?? ''}`);
      return url.toString().replace(/\/+$/, '');
    },
    [speed, speedHack, baseSize],
  );

  // for this one, we will just wait the whole value
  // and then do something with it
  const getApi = (api: number, signal: AbortSignal) =>
    fetch(getUrl(api), {
      signal,
    }).then(async (res) => {
      // but before that, we clone the body
      // the clone is because only one reader is allowed
      // with this, we can read it in parallel
      // and count how many results we have
      await parseReaderClone(
        res.clone().body?.getReader(),
        signal,
        changeBoardCurrent,
      );

      return res.text();
    });

  return {
    getApi,
    resetCounter: reset,
  };
};

/**
 * stream based fetch that will do something as
 * the data comes in
 */
export const useStreamFetchApi = (
  setLights: SetLights,
  counterUtils = boardCounter(),
) => {
  const { getCount, increment, reset: resetCounter } = counterUtils;
  const { speed } = useSpeed();
  const { size: baseSize } = useSize();
  const { changeMax, changeCurrent, reset: resetProgress } = useProgress();

  const changeBoardCurrent = (board: number) => {
    increment(board);
    changeCurrent(board, getCount(board));
  };

  const reset = () => {
    resetCounter();
    resetProgress();
  };

  const getUrl = useCallback(
    (api: number) => {
      const delay = typeof speed === 'function' ? speed() : speed;
      const size = typeof baseSize === 'function' ? baseSize() : baseSize;
      changeMax(api, size);

      const url = new URL(`${BASE_URL(api)}/${size ?? ''}/${delay ?? ''}`);
      return url.toString().replace(/\/+$/, '');
    },
    [speed, baseSize],
  );

  const getApi = (api: number, signal: AbortSignal) =>
    fetch(getUrl(api), {
      signal,
    }).then(async (res) => {
      const reader = res.body?.getReader();
      if (!reader) {
        return;
      }

      // the accumulator
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        // stop when done or aborted
        // aborted is triggered when changing pages
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

  return {
    getApi,
    resetCounter: reset,
  };
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

/**
 * keep track of the number of times a board has been toggled
 */
export function boardCounter() {
  const resetCount = () =>
    Object.fromEntries(
      Array.from({ length: 9 }, (_, i) => [i + 1, 0]),
    ) as Record<number, number>;

  let count = resetCount();
  return {
    getCount: (board: number) => count[board],
    increment: (board: number, by?: number) => {
      count[board] += by ?? 1;
    },
    reset: (board?: number) => {
      if (board) {
        count[board] = 0;
        return;
      }

      count = resetCount();
    },
  };
}

/**
 * takes the cloned reader to keep track
 * of the number of how much data has been read already
 */
async function parseReaderClone(
  reader: ReadableStreamDefaultReader<Uint8Array> | undefined,
  signal: AbortSignal,
  changeBoardCurrent: (index: number) => void,
) {
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
      buffer = parseProgressAndRemaining(
        buffer + decoder.decode(value),
        changeBoardCurrent,
      );
    }
  }
}

export function usePostToApi() {
  const { addToMax } = useProgress();

  // we use this one here because
  // in case of playing with the api
  // it might hit the limit of connections
  // so, this one bypass the limit
  const BASE_URL_POST = (api: number) => {
    if (api === 0) {
      return `http://${window.location.host}:58880`;
    }

    return `http://${window.location.host}:5888${api}/${api}`;
  };

  return async ({
    api,
    key,
    value,
  }: {
    api: number;
    key: 'quantity' | 'speed';
    value: number;
  }) => {
    // will respond with a boolean based
    // on if it was successful or not
    // in changing the value
    const result: boolean | boolean[] = await fetch(
      `${BASE_URL_POST(api)}/${key}/${value}`,
      {
        method: 'POST',
      },
    ).then((res) => res.json());

    // in case of qty, we want to update the max
    // for "api > 0", true or skip
    // for api 0 ("change all"), even if all false
    // array of booleans is still truthy
    if (result && key === 'quantity') {
      if (api > 0 || !Array.isArray(result)) {
        return addToMax(api, value);
      }

      result.forEach((result, index) => {
        // if true (changed), update the max
        result && addToMax(index + 1, value);
      });
    }
  };
}
