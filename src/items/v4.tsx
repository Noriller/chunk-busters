import { makeBoardHook, makeOffBoard } from '@/components/board/useBoards';
import { type NavItem } from '.';
import { useStreamFetchApi } from './utils/fetch';
import type { SetLights } from './utils/parseLine';

export const v4 = {
  id: 'v4',
  title: 'v4',
  content: /*md*/ `
## V4: let's start spicing it up

This will be the \`v0\` revisited, but with a twist!

We will still do this:

\`\`\`typescript
await fetch1();
handleResult(1);
await fetch2();
handleResult(2);
...
await fetch9();
handleResult(3);
\`\`\`

However... we gonna start consuming the results as they come in.

This means that for each fetch... as the results come in, we will start rendering them.

---

This might come as a surprise,
but we are not fetching only the ammount of results that you're seeing before!

`,
  boardHook: makeBoardHook(useMultiFetch),
} satisfies NavItem;

export function useMultiFetch(setLights: SetLights, getMounted: () => boolean) {
  const { getApi, resetCounter } = useStreamFetchApi(setLights);

  async function doMultiFetch(signal: AbortSignal) {
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
      resetCounter();
      if (getMounted()) {
        doMultiFetch(signal);
      }
    }, 2000);
  }

  return doMultiFetch;
}
