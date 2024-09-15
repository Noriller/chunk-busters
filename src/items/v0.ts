import { BoardLights, makeOffBoard } from '@/components/board/useBoards';
import { useEffect, useState } from 'react';
import { type NavItem } from '.';
import { parseAndToggleOnce } from './parseLine';
const goFetch = (api: number, size?: number, delay?: number) => {
  const url = new URL(`http://localhost/api/${api}/${size ?? ''}/${delay ?? ''}`);
  const cleanedUrl = url.toString().replace(/\/+$/, '');

  return fetch(cleanedUrl).then(res => res.text());
};

// this is a bit of a hack to get it to run the example
// this allows for it to run in a loop and stop after leaving
let mounted = true;
const getMounted = () => mounted;

export const multiFetch = async (
  setLights: React.Dispatch<React.SetStateAction<BoardLights>>,
  getMounted: () => boolean,
  size?: number,
  delay?: number
) => {
  if (!getMounted()) {
    return;
  }

  const fetch1 = await goFetch(1, size, delay);
  parseAndToggleOnce(fetch1, setLights);

  const fetch2 = await goFetch(2, size, delay);
  parseAndToggleOnce(fetch2, setLights);

  const fetch3 = await goFetch(3, size, delay);
  parseAndToggleOnce(fetch3, setLights);

  const fetch4 = await goFetch(4, size, delay);
  parseAndToggleOnce(fetch4, setLights);

  const fetch5 = await goFetch(5, size, delay);
  parseAndToggleOnce(fetch5, setLights);

  const fetch6 = await goFetch(6, size, delay);
  parseAndToggleOnce(fetch6, setLights);

  const fetch7 = await goFetch(7, size, delay);
  parseAndToggleOnce(fetch7, setLights);

  const fetch8 = await goFetch(8, size, delay);
  parseAndToggleOnce(fetch8, setLights);

  const fetch9 = await goFetch(9, size, delay);
  parseAndToggleOnce(fetch9, setLights);

  const timeout = setTimeout(() => {
    clearTimeout(timeout);
    setLights(makeOffBoard());
    if (getMounted()) {
      multiFetch(setLights, getMounted, size, delay);
    }
  }, 2000);
};

const boardHook: NavItem['boardHook'] = () => {
  mounted = true;
  const [lights, setLighs] = useState(makeOffBoard());

  useEffect(() => {
    multiFetch(setLighs, getMounted, 2, 10);

    return () => {
      mounted = false;
    };
  }, []);

  return lights;
};

export const v0 = {
  id: 'v0',
  title: 'v0',
  content: /*md*/`
## The Naive V0

You have the API's, you \`fetch\` each of them, you wait and you have the data.

\`\`\`typescript
await fetch1();
await fetch2();
await fetch3();
...
\`\`\`

Only then you start rendering.
`,
  boardHook,
} satisfies NavItem;
