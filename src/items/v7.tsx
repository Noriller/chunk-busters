import { makeBoardHook, makeOffBoard } from '@/components/board/useBoards';
import { type NavItem } from '.';
import { useStreamFetchApi } from './utils/fetch';
import { type SetLights } from './utils/parseLine';

export const v7 = {
  id: 'v7',
  title: 'v7',
  content: /*md*/ `
## V7: finally! on demand fetch and render multiple sources!

We call **one** API, it then calls it's multiple sources.

As the backend receives the data from the sources, it sends it to us... in chunks.

The frontend, in turn, renders the data as it comes.

It might be a few KB or maybe a few GB!

Doesn't matter because we use the data as it come and then throw away what we don't need anymore.

Go back the examples and try to see what happens if you try a million items!
(spoiler alert: you better have a LOT of RAM! =D)

---

The code is basically the same, be it frontend or backend.

Then again, this is only a demo, it works for this case, but when
you need to transform the data, pipe it through \`JSON.parse\` to
handle objects... well... things get a little more complicated.

In any case... the most basic implementation possible, no fancy stuff,
no libs, just \`fetch\` and \`Vanilla JS\`:

\`\`\`typescript
// in both frontend and backend we can use the same \`fetch\` api
fetch(url, {
  // we use the AbortController to cancel the request
  // if the user navigates away (connection closed)
  signal,
}).then(async (res) => {
  // instead of the "normal" \`res.json()\` or \`res.text()\`
  // we use the body of the response
  // and get the reader from the body
  // this is a \`ReadableStream\`
  // (there are other types of streams and ways to consume them)
  const reader = res.body?.getReader();
  if (!reader) {
    return;
  }

  // remember we are "low level" here
  // streams can be strings or binary data
  // for this one we know it's a string
  // so we will accumulate it in a string
  let buffer = '';

  // read until the stream is done
  while (true) {
    const { done, value } = await reader.read();

    // if the stream is done (or the user aborted)
    if (done || signal.aborted) {
      // cancel the stream, exit the loop
      reader.cancel(signal.reason);
      break;
    }

    // if we have a value
    if (value) {
      buffer = buffer + new TextDecoder().decode(value);

      // here is where the magic happens!
      // we check if we can consume something from the buffer
      if (canConsumeSomething(buffer)) {
        const [chunk, remaining] = consumeSomething(buffer);
        // do something with the chunk

        // in the frontend
        renderChunk(chunk);
        // in the backend
        sendResponse(chunk);

        // and then we update the buffer
        buffer = remaining;
      }
    }
  }
});
\`\`\`

`,
  boardHook: makeBoardHook(useOneFetch),
} satisfies NavItem;

export function useOneFetch(setLights: SetLights, getMounted: () => boolean) {
  const { getApi, resetCounter } = useStreamFetchApi(setLights);

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
