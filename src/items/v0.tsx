import { makeOffBoard, type BoardLights } from '@/components/board/useBoards';
import { useSpeed } from '@/components/SpeedContext';
import { useEffect, useState } from 'react';
import { type NavItem } from '.';
import { mountedHack, useFetchApi } from './utils/fetch';
import { parseAndToggleOnce } from './utils/parseLine';

const { getMounted, setMounted } = mountedHack();

const boardHook = () => {
  const [lights, setLights] = useState(makeOffBoard());
  const { speed } = useSpeed();

  const multiFetch = useMultiFetch(setLights, getMounted, 2);

  useEffect(() => {
    setMounted(true);
    const controller = new AbortController();

    multiFetch(controller.signal).catch(() => {
      /** intentionally blank */
    });

    return () => {
      setMounted(false);
      controller.abort('unmount');
    };
  }, [speed]);

  return lights;
};

export const v0 = {
  id: 'v0',
  title: 'v0',
  content: /*md*/ `
## The Naive V0

You have the API's, you \`fetch\` each of them, you wait and you have the data.

\`\`\`typescript
await fetch1();
await fetch2();
await fetch3();
...
\`\`\`

Only then you start rendering.

The main problem: what if the API was slower?

> "Oh... no one actually does that..."

_Are you sure? Like, absolutely sure?_

`,
  boardHook,
} satisfies NavItem;

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
