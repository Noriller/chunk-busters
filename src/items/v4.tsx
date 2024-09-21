import { makeOffBoard } from '@/components/board/useBoards';
import { useSpeed } from '@/components/SpeedContext';
import { useEffect, useState } from 'react';
import { type NavItem } from '.';
import { mountedHack, useStreamFetchApi } from './utils/fetch';
import type { SetLights } from './utils/parseLine';

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

export const v4 = {
  id: 'v4',
  title: 'v4',
  content: /*md*/ `
## V4: let's start spicing it up

This will be the \`v0\` revisited, but with a twist!

We will still do this:

\`\`\`typescript
await fetch1();
await fetch2();
await fetch3();
...
\`\`\`

However... we gonna start consuming the results as they come in.

This means that for each fetch... as the results come in, we will start rendering them.

---

This might come as a surprise,
but we are not fetching only the ammount of results that you're seeing before!

`,
  boardHook,
} satisfies NavItem;

export const useMultiFetch = (
  setLights: SetLights,
  getMounted: () => boolean,
  size?: number,
) => {
  const getApi = useStreamFetchApi(setLights, size);

  async function doMultiFetch(signal: AbortSignal, newSize = size) {
    if (!getMounted()) {
      return;
    }

    await getApi(1, signal);
    await getApi(2, signal);
    await getApi(3, signal);
    await getApi(4, signal);
    await getApi(5, signal);
    await getApi(6, signal);
    await getApi(7, signal);
    await getApi(8, signal);
    await getApi(9, signal);

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
