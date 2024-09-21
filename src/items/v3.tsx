import { makeOffBoard, type BoardLights } from '@/components/board/useBoards';
import { useSpeed } from '@/components/SpeedContext';
import { useEffect, useState } from 'react';
import { type NavItem } from '.';
import { mountedHack, useFetchApi } from './utils/fetch';
import { parseAndToggleOnce } from './utils/parseLine';
import { useParallelFetch } from './v1';

const { getMounted, setMounted } = mountedHack();

const boardHook = () => {
  const [lights, setLights] = useState(makeOffBoard());
  const { speed } = useSpeed();

  const multiFetch = useParallelFetch(setLights, getMounted, 2, false);

  useEffect(() => {
    setMounted(true);
    const controller = new AbortController();

    multiFetch(controller.signal).catch(() => {
      /** intentionally blank */
    });

    return () => {
      setMounted(false);
      controller.abort('unmount');
    };
  }, [speed]);

  return lights;
};

export const v3 = {
  id: 'v3',
  title: 'v3',
  content: /*md*/ `
## V3, the V1 revisited...

I'm sorry... I was lying to you...

\`\`\`typescript
await Promise.all([
  fetch1(),
  fetch2(),
  fetch3(),
  ...
]);
\`\`\`

This is good and all... up to a point.

But...

Browsers enforce a max parallel connections of 6 in most modern browsers.

This means that you can't do all 9 fetches in parallel.
(Yes, there's \`http/2\`, but you can't really assume it's available for everyone.)

---

This is the actual example without the hack I had in place.

Which was just making it wait half of the normal time, so, the 2 batches:

- first 6
- second 3

Would take the "same amount" of time as if only one batch was being fetched.

---

Ok... but then what?

`,
  boardHook,
} satisfies NavItem;
