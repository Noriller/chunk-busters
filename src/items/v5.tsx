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

  const multiFetch = useParallelFetch(setLights, getMounted, 2);

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

export const v5 = {
  id: 'v5',
  title: 'v5',
  content: /*md*/ `
## V5: let's make things burn!

This will be the \`v1\` revisited (again!), this time with streaming.

As you've might realised last time... we are using Streaming!

This means we can consume and render the results as they come in.

So, now we will still do this again:

\`\`\`typescript
await fetch1();
await fetch2();
await fetch3();
...
\`\`\`

And for each one of them we will start rendering them as they come.

Again... http/1 means we can't do all 9 fetches in one batch.

---

_Let's hope the computer can handle that..._

`,
  boardHook,
} satisfies NavItem;

export const useParallelFetch = (
  setLights: SetLights,
  getMounted: () => boolean,
  size?: number,
) => {
  const getApi = useStreamFetchApi(setLights, size);

  async function doMultiFetch(signal: AbortSignal, newSize = size) {
    if (!getMounted()) {
      return;
    }

    await Promise.all(
      Array.from({ length: 9 }, (_, i) => getApi(i + 1, signal)),
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
