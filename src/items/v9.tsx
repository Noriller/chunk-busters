import { makeBoardHook, makeOffBoard } from '@/components/board/useBoards';
import { type NavItem } from '.';
import { useStreamFetchApi } from './utils/fetch';
import { type SetLights } from './utils/parseLine';
import { useProgress } from '@/components/ProgressContext';
import { useEffect } from 'react';

export const v9 = {
  id: 'v9',
  title: 'v9',
  content: /*md*/ `
## V9: Play Around, Have Fun!

### The next version is on _YOU_ ok?

But, if you need help...

_I'm here._ =D

---

If you go to the other versions, now you can also play around there.

`,
  boardHook: makeBoardHook(useOneFetch),
} satisfies NavItem;

export function useOneFetch(setLights: SetLights, getMounted: () => boolean) {
  const { getApi, resetCounter } = useStreamFetchApi(setLights);
  const { useExtra } = useProgress();

  useEffect(() => {
    useExtra(true);
  }, []);

  async function doFetch(signal: AbortSignal) {
    if (!getMounted()) {
      return;
    }

    await getApi(0, signal);

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
