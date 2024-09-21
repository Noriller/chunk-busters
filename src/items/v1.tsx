import { makeOffBoard } from '@/components/board/useBoards';
import { useSpeed } from '@/components/SpeedContext';
import { useEffect, useState } from 'react';
import { type NavItem } from '.';
import { mountedHack, useFetchApi } from './utils/fetch';
import { parseAndToggleOnce, type SetLights } from './utils/parseLine';

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

export const v1 = {
  id: 'v1',
  title: 'v1',
  content: /*md*/ `
## The Eager V1

Obviously \`awaiting\` each of them is a bad idea.
So... Obviously you just use \`Promise.all\`.
(or \`Promise.allSettled\` if you want to be fancy... or you know... actually handle errors)

\`\`\`typescript
await Promise.all([
  fetch1(),
  fetch2(),
  fetch3(),
  ...
]);
\`\`\`

This way, all \`fetch\` calls are executed in parallel.

This is probably the way most would handle this problem right?

---

But... is this actually the best way to solve this problem?

---

The main problem: what if you had ONE of those being slow?

No matter how fast the others are, you still have to wait for the slowest to finish.

`,
  boardHook,
} satisfies NavItem;

export const useParallelFetch = (
  setLights: SetLights,
  getMounted: () => boolean,
  size?: number,
  speedHack = true,
) => {
  const getApi = useFetchApi(size, speedHack);
  async function doMultiFetch(signal: AbortSignal, newSize = size) {
    if (!getMounted()) {
      return;
    }

    const promises = Array.from({ length: 9 }, (_, i) => getApi(i + 1, signal));

    (await Promise.all(promises)).map((fetch) =>
      parseAndToggleOnce(fetch, setLights),
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
