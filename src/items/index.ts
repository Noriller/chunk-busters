import { useRandomBoards } from '@/components/board/useBoards';
import { v1 } from './v1';

export type NavItem = {
  id: string;
  title: string;
  content: string;
  boardHook: typeof useRandomBoards;
};

export const navItems = [
  v1,
  {
    id: '1',
    title: 'Navigation 1',
    content: 'Content for Navigation 1',
    boardHook: useRandomBoards,
  },
  {
    id: '2',
    title: 'Navigation 2',
    content: 'Content for Navigation 2',
    boardHook: useRandomBoards,
  },
  {
    id: '3',
    title: 'Navigation 3',
    content: 'Content for Navigation 3',
    boardHook: useRandomBoards,
  },
  // Add more navigation items to demonstrate scrolling
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 4}`,
    title: `Navigation ${i + 4}`,
    content: `Content for Navigation ${i + 4}`,
    boardHook: useRandomBoards,
  })),
];
