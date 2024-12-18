import { useRandomBoards } from '@/components/board/useBoards';
import { v0 } from './v0';
import { v1 } from './v1';
import { v2 } from './v2';
import { v3 } from './v3';
import { v4 } from './v4';
import { v5 } from './v5';
import { v6 } from './v6';
import { v7 } from './v7';
import { v8 } from './v8';
import { v9 } from './v9';

export type NavItem = {
  id: string;
  title: string;
  content: string;
  boardHook: typeof useRandomBoards;
};

export const navItems = [
  v0,
  v1,
  v2,
  v3,
  v4,
  v5,
  v6,
  v7,
  v8,
  v9,
];
