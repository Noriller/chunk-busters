import { makeOffBoard } from '@/components/board/useBoards';
import { useSpeed } from '@/components/SpeedContext';
import { useEffect, useState } from 'react';
import { type NavItem } from '.';
import { mountedHack, useMultiFetch } from './utils/fetch';

const { getMounted, setMounted } = mountedHack();

const boardHook = () => {
  const [lights, setLights] = useState(makeOffBoard());
  const { speed } = useSpeed();

  const multiFetch = useMultiFetch(setLights, getMounted, 2);

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

export const v0 = {
  id: 'v0',
  title: 'v0',
  content: /*md*/ `
## The Naive V0

You have the API's, you \`fetch\` each of them, you wait and you have the data.

\`\`\`typescript
await fetch1();
await fetch2();
await fetch3();
...
\`\`\`

Only then you start rendering.

The main problem: what if the API was slower?

> "Oh... no one actually does that..."

_Are you sure? Like, absolutely sure?_

`,
  boardHook,
} satisfies NavItem;
