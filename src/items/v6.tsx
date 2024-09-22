import { makeBoardHook, makeOffBoard } from '@/components/board/useBoards';
import { type NavItem } from '.';
import { useFetchApi } from './utils/fetch';
import { parseAndToggleOnce, type SetLights } from './utils/parseLine';

export const v6 = {
  id: 'v6',
  title: 'v6',
  content: /*md*/ `
## V6: one API to rule them all!

---

I know what you want... _Not yet... =D_

---

Finally we will ditch having to do all 9 fetches!

Let the backend handle that for us and give us one API to rule them all!

\`\`\`typescript
await fetchAll();
handleAllResults(results);
\`\`\`

The best thing of this is that you can still just \`await\` the results.

The only **gotcha** is that data is out of order!
But, the code for the frontend and backend are basically the same!

---

**But without further ado...**

_\\~\\~ drum roll noises \\~\\~_

`,
  boardHook: makeBoardHook(useOneFetch),
} satisfies NavItem;

export function useOneFetch(setLights: SetLights, getMounted: () => boolean) {
  const { getApi, resetCounter } = useFetchApi();

  async function doFetch(signal: AbortSignal) {
    if (!getMounted()) {
      return;
    }

    const allData = await getApi(0, signal);
    parseAndToggleOnce(allData, setLights);

    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setLights(makeOffBoard());
      resetCounter();
      if (getMounted()) {
        doFetch(signal);
      }
    }, 2000);
  }

  return doFetch;
}
