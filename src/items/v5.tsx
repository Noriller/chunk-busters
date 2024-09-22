import { makeBoardHook, makeOffBoard } from '@/components/board/useBoards';
import { type NavItem } from '.';
import { useStreamFetchApi } from './utils/fetch';
import type { SetLights } from './utils/parseLine';

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
await Promise.all([
  fetch1().then(handleResult),
  fetch2().then(handleResult),
  ...
  fetch9().then(handleResult),
]);
\`\`\`

And for each one of them we will start rendering them as they come.

Again... http/1 means we can't do all 9 fetches in one batch.

---

_Let's hope the computer can handle that..._

`,
  boardHook: makeBoardHook(useParallelFetch),
} satisfies NavItem;

export function useParallelFetch(
  setLights: SetLights,
  getMounted: () => boolean,
) {
  const { getApi, resetCounter } = useStreamFetchApi(setLights);

  async function doMultiFetch(signal: AbortSignal) {
    if (!getMounted()) {
      return;
    }

    await Promise.all(
      Array.from({ length: 9 }, (_, i) => getApi(i + 1, signal)),
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
