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

It might be a few _KB_ or maybe a LOT of _GBs_!

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

  // this shouldn't happen
  // but since the type say it can be nullish
  // we check for it
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
      // the value is a Uint8Array
      // so we convert it to a string
      // there are other encodings,
      // but usually we want utf-8
      const decoder = new TextDecoder('utf-8').decode;

      // decode and add to the buffer
      buffer = buffer + decoder(value);

      // here is where the magic happens!
      // we check if we can consume something from the buffer
      // in a simple string, the slice we will use
      // if its JSON, the slice that can be parsed
      // note that for JSON, we can split the stringified
      // JSON into chunks that can be parsed (\`JSON.parse\`)
      // but you can also parse chunks of the object/array
      // as it comes and accumulate them somewhere to be used
      // this is, of course, a lot more complicated
      if (canConsumeSomething(buffer)) {
        // do something with the chunk
        // for example, split into what
        // will be consumed and the remaining
        // this can be as simple as:
        // const splitIndex = buffer.indexOf(separator);
        // const chunk = buffer.slice(0, splitIndex);
        // const remaining = buffer.slice(splitIndex + 1);
        const [chunk, remaining] = consumeSomething(buffer);

        // in the frontend, render the chunk
        renderChunk(chunk);
        // in the backend, send the chunk
        sendChunk(chunk);

        // and then we update the buffer
        buffer = remaining;
      }
    }
  }
});
\`\`\`

---

> I know what you're thinking...
>
> It is possible... But it's madness, it's stupid...
>
> ---
>
> MOOOOOOOM I want Websockets!
>
> No sweetheart, we have websockets at home!
>
> Websockets at home: next?

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
