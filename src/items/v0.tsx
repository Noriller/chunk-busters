import { makeBoardHook, makeOffBoard } from '@/components/board/useBoards';
import { type NavItem } from '.';
import { useFetchApi } from './utils/fetch';
import { parseAndToggleOnce, type SetLights } from './utils/parseLine';

export const v0 = {
  id: 'v0',
  title: 'v0',
  content: /*md*/ `
## The Naive V0

You have the API's, you \`fetch\` each of them, you wait and you have the data.

\`\`\`typescript
await fetch1();
handleResult(1);
await fetch2();
handleResult(2);
...
await fetch9();
handleResult(9);
\`\`\`

Only then you start rendering. Rinse and repeat.

The main problem: you have to wait each one complete,  
also... what if the API was slower?

> "Oh... no one actually does that..."
>
> _Are you sure? Like, absolutely sure?_

`,
  boardHook: makeBoardHook(useMultiFetch),
} satisfies NavItem;

export function useMultiFetch(setLights: SetLights, getMounted: () => boolean) {
  const { getApi, resetCounter } = useFetchApi(undefined);
  async function doMultiFetch(signal: AbortSignal) {
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
      resetCounter();
      if (getMounted()) {
        doMultiFetch(signal);
      }
    }, 2000);
  }

  return doMultiFetch;
}
