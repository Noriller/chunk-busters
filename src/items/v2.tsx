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

  const multiFetch = useParallelHandleFetch(setLights, getMounted, 2);

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

export const v2 = {
  id: 'v2',
  title: 'v2',
  content: /*md*/ `
## The Smarter Eager V2

If waiting for all to complete is a bad idea, then we can just start
fetching all in parallel and handle each as they come.

_I'm smart, right?_

\`\`\`typescript
await Promise.all([
  fetch1().then(handleResult),
  fetch2().then(handleResult),
  fetch3().then(handleResult),
  ...
]);
\`\`\`

This way, all \`fetch\` calls are executed in parallel, but we handle as they come!

---

This has to be the best way to solve this problem? Right? Right?

---

> Hm... wait... what is going on there!?

---

Go to the next one... we have to talk...

`,
  boardHook,
} satisfies NavItem;

const useParallelHandleFetch = (
  setLights: React.Dispatch<React.SetStateAction<BoardLights>>,
  getMounted: () => boolean,
  size?: number,
) => {
  const getApi = useFetchApi(size);
  async function doMultiFetch(signal: AbortSignal, newSize = size) {
    if (!getMounted()) {
      return;
    }

    const promises = Array.from({ length: 9 }, (_, i) => getApi(i + 1, signal));

    await Promise.all(
      promises.map(async (fetch) => {
        parseAndToggleOnce(await fetch, setLights);
      }),
    );

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
