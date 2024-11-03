import { makeBoardHook, makeOffBoard } from '@/components/board/useBoards';
import { type NavItem } from '.';
import { useFetchApi } from './utils/fetch';
import { parseAndToggleOnce, type SetLights } from './utils/parseLine';

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
  ...
  fetch9(),
]);
handleAllResults(results);
\`\`\`

This way, all \`fetch\` calls are executed in parallel.

This is probably the way most would handle this problem right?

---

> But... is this actually the best way to solve this problem?

---

The main problem: what if you had ONE of those being slow?

No matter how fast the others are, you still have to wait for the slowest to finish.

`,
  boardHook: makeBoardHook(useParallelFetch),
} satisfies NavItem;

export function useParallelFetch(
  setLights: SetLights,
  getMounted: () => boolean,
  speedHack = true,
) {
  const { getApi, resetCounter } = useFetchApi(speedHack);
  async function doMultiFetch(signal: AbortSignal) {
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
      resetCounter();
      if (getMounted()) {
        doMultiFetch(signal);
      }
    }, 2000);
  }

  return doMultiFetch;
}
