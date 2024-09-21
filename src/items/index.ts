import { useRandomBoards } from '@/components/board/useBoards';
import { v0 } from './v0';
import { v1 } from './v1';
import { v2 } from './v2';
import { v3 } from './v3';

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
  // Add more navigation items to demonstrate scrolling
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${i}`,
    title: `Navigation ${i}`,
    content: `Content for Navigation ${i}`,
    boardHook: useRandomBoards,
  })),
];
