import { navItems } from '@/items';
import { useCallback, useMemo, useState } from 'react';
import { Board } from './board';
import { useRandomBoards } from './board/useBoards';
import { HighlightedMarkdown } from './HighlightedMarkdown';
import { Button } from './ui/button';

function useSearchParams(spName: string) {
  const sp = new URLSearchParams(window.location.search);
  const get = () => sp.get(spName);

  const set = useCallback(
    (value: string | null) => {
      if (value === null) {
        sp.delete(spName);
      } else {
        sp.set(spName, value);
      }

      window.history.pushState(
        {},
        '',
        `${window.location.pathname}?${sp.toString()}`,
      );
    },
    [spName],
  );

  return [get, set] as const;
}

function useSearchParamsState(
  spName: string,
  defaultValue: string | null = null,
) {
  const [get, set] = useSearchParams(spName);
  const [state, setState] = useState(get() || defaultValue);
  const update = useCallback((value: string | null) => {
    setState(value);
    set(String(value));
  }, []);

  return [state, update] as const;
}

export function useNav() {
  const [activeNav, setActiveNav] = useSearchParamsState('nav', 'v1');

  const navContent = useMemo(
    () => (
      <HighlightedMarkdown>
        {navItems.find((item) => item.id === activeNav)?.content ??
          /*md*/ `
## Nothing to See Here!

Try a **different** navigation item.

What you're seeing is just a _placeholder board_.
`}
      </HighlightedMarkdown>
    ),
    [activeNav],
  );

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
    return <Board board={boardHook()} />;
  }, [boardHook]);

  return {
    navContent,
    NavButtons,
    Board: BoardWithHook,
  };
}
