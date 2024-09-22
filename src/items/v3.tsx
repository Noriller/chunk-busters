import { makeBoardHook } from '@/components/board/useBoards';
import { type NavItem } from '.';
import { useParallelFetch } from './v1';

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
  ...
  fetch9(),
]);
handleAllResults(results);
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
  boardHook: makeBoardHook((...args) => useParallelFetch(...args, false)),
} satisfies NavItem;
