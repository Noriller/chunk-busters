import { navItems } from '@/items';
import { useCallback, useMemo } from 'react';
import { Board } from './board';
import { useRandomBoards } from './board/useBoards';
import { HighlightedMarkdown } from './HighlightedMarkdown';
import { Button } from './ui/button';
import { useSpeed } from './SpeedContext';
import { useSearchParamsState } from './useSearchParamsState';

const notFound = /*md*/ `
## Nothing to See Here!

Try a **different** navigation item.

What you're seeing is just a _placeholder board_.
`;

const home = /*md*/ `
## Home

What you're seeing is just a _placeholder board_ (_Cool Right?_).

Start at the **v0** to check even crazier things. **=D**
`;

const defaultsContent = {
  home,
  notFound,
} as const;

export function useNav() {
  const [activeNav, setActiveNav] = useSearchParamsState('nav', 'home');
  const { speed, SpeedSwitcher } = useSpeed();

  const navContent = useMemo(() => {
    const getContent = () => {
      if (activeNav === 'home') {
        return { type: 'home' } as const;
      }

      return (
        navItems.find((item) => item.id === activeNav)?.content ?? {
          type: 'notFound' as const,
        }
      );
    };

    const content = getContent();

    return (
      <>
        <HighlightedMarkdown>
          {typeof content === 'string'
            ? content
            : defaultsContent[content.type]}
        </HighlightedMarkdown>
        {typeof content === 'string' && SpeedSwitcher}
      </>
    );
  }, [activeNav, speed]);

  const changeActiveNav = useCallback((id: string) => {
    if (navItems.find((item) => item.id === id)) {
      setActiveNav(String(id));
    }
  }, []);

  const NavButtons = useCallback(() => {
    return navItems.map((item) => (
      <Button
        key={item.id}
        onClick={() => changeActiveNav(item.id)}
        variant={activeNav === item.id ? 'secondary' : 'ghost'}
        className="mb-2"
      >
        {item.title}
      </Button>
    ));
  }, [activeNav]);

  const boardHook =
    navItems.find((item) => item.id === activeNav)?.boardHook ??
    useRandomBoards;

  const BoardWithHook = useCallback(() => {
    return <Board board={boardHook()} key={speed.toString()} />;
  }, [boardHook, speed]);

  return {
    navContent,
    NavButtons,
    Board: BoardWithHook,
  };
}
