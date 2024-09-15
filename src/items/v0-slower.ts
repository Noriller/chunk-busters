import { makeOffBoard } from '@/components/board/useBoards';
import { useEffect, useState } from 'react';
import { type NavItem } from '.';
import { multiFetch } from './v0';

let mounted = true;
const getMounted = () => mounted;

const boardHook: NavItem['boardHook'] = () => {
  const [lights, setLighs] = useState(makeOffBoard());

  useEffect(() => {
    multiFetch(setLighs, getMounted, 2, 100);

    return () => {
      mounted = false;
    };
  }, []);

  return lights;
};

export const v0_slower = {
  id: 'v0-slower',
  title: 'v0 but slower',
  content: /*md*/`
## The Naive V0 - but slower

You saw the **v0**, but what if the API was slower?
`,
  boardHook,
} satisfies NavItem;
