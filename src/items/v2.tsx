import { makeBoardHook, makeOffBoard } from '@/components/board/useBoards';
import { type NavItem } from '.';
import { useFetchApi } from './utils/fetch';
import { parseAndToggleOnce, type SetLights } from './utils/parseLine';

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
  ...
  fetch9().then(handleResult),
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
  boardHook: makeBoardHook(useParallelHandleFetch),
} satisfies NavItem;

function useParallelHandleFetch(
  setLights: SetLights,
  getMounted: () => boolean,
) {
  const getApi = useFetchApi();
  async function doMultiFetch(signal: AbortSignal) {
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
        doMultiFetch(signal);
      }
    }, 2000);
  }

  return doMultiFetch;
}
