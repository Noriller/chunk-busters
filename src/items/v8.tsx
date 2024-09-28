import { makeBoardHook, makeOffBoard } from '@/components/board/useBoards';
import { type NavItem } from '.';
import { useStreamFetchApi } from './utils/fetch';
import { type SetLights } from './utils/parseLine';
import { useProgress } from '@/components/ProgressContext';
import { useEffect } from 'react';

export const v8 = {
  id: 'v8',
  title: 'v8',
  content: /*md*/ `
## V8: This madness... is on _YOU_ ok?

> So, the generator on the backend is a function right?
>
> And you send some data to it? Yes...
>
> If you could change that data on the fly...
>
> Then you don't even need to stop what you're doing...

Again... bad idea, but maybe you could argue
that there are uses for whatever this is.

For example, if you're constricted to how many
connections you can have, like if you go back
a few years back and then you need to support
a browser that can have only 2 connections...

So... you would have one receiving the data and
another one changing/asking what you want to receive.

Aside from that... I have no idea... do you?

Anyway... push the buttons, change how many
results to receive and/or how fast the API will
send them.

There are speed limits and if you remove the quantity,
then it will just close the connection.
Could I make it just start again? Sure... will I? Nope.

`,
  boardHook: makeBoardHook(useOneFetch),
} satisfies NavItem;

export function useOneFetch(setLights: SetLights, getMounted: () => boolean) {
  const { getApi, resetCounter } = useStreamFetchApi(setLights);
  const { useExtra } = useProgress();

  useEffect(() => {
    useExtra(true);

    return () => {
      useExtra(false);
    };
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
