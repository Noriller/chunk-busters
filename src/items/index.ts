import { useRandomBoards } from '@/components/board/useBoards';
import { v0 } from './v0';

export type NavItem = {
  id: string;
  title: string;
  content: string;
  boardHook: typeof useRandomBoards;
};

export const navItems = [
  v0,
  // Add more navigation items to demonstrate scrolling
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i}`,
    title: `Navigation ${i}`,
    content: `Content for Navigation ${i}`,
    boardHook: useRandomBoards,
  })),
];
