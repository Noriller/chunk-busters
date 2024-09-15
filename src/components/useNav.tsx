import { useState, useCallback } from 'react';
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
  const [activeNav, setActiveNav] = useSearchParamsState('nav', '1');

  const navItems = [
    { id: 1, title: 'Navigation 1', content: 'Content for Navigation 1' },
    { id: 2, title: 'Navigation 2', content: 'Content for Navigation 2' },
    { id: 3, title: 'Navigation 3', content: 'Content for Navigation 3' },
    // Add more navigation items to demonstrate scrolling
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 4,
      title: `Navigation ${i + 4}`,
      content: `Content for Navigation ${i + 4}`,
    })),
  ];

  // const navContent = navItems.find((item) => item.id === activeNav)?.content;
  const navContent = `${activeNav}
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quas
    itaque perferendis dolorum illo illum sequi veritatis sapiente
    repellendus! Sed pariatur magnam possimus suscipit officia nisi
    explicabo ullam dolor voluptate? Lorem ipsum dolor sit amet
    consectetur adipisicing elit. Id quas itaque perferendis dolorum
    illo illum sequi veritatis sapiente repellendus! Sed pariatur
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quas
    itaque perferendis dolorum illo illum sequi veritatis sapiente
    repellendus! Sed pariatur magnam possimus suscipit officia nisi
    explicabo ullam dolor voluptate? Lorem ipsum dolor sit amet
    explicabo ullam dolor voluptate? Lorem ipsum dolor sit amet
    consectetur adipisicing elit. Id quas itaque perferendis dolorum
    illo illum sequi veritatis sapiente repellendus! Sed pariatur
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quas
    itaque perferendis dolorum illo illum sequi veritatis sapiente
    repellendus! Sed pariatur magnam possimus suscipit officia nisi
    explicabo ullam dolor voluptate? Lorem ipsum dolor sit amet
    consectetur adipisicing elit. Id quas itaque perferendis dolorum
    illo illum sequi veritatis sapiente repellendus! Sed pariatur
    magnam possimus suscipit officia nisi explicabo ullam dolor
    voluptate? Lorem ipsum dolor sit amet consectetur adipisicing
    elit. Id quas itaque perferendis dolorum illo illum sequi
    veritatis sapiente repellendus! Sed pariatur magnam possimus
    suscipit officia nisi explicabo ullam dolor voluptate? Lorem ipsum
    dolor sit amet consectetur adipisicing elit. Id quas itaque
    perferendis dolorum illo illum sequi veritatis sapiente
    repellendus! Sed pariatur magnam possimus suscipit officia nisi
    explicabo ullam dolor voluptate?
  `;

  const changeActiveNav = useCallback((id: number) => {
    if (navItems.find((item) => item.id === id)) {
      setActiveNav(String(id));
    }
  }, []);

  const NavButtons = useCallback(() => {
    return navItems.map((item) => (
      <Button
        key={item.id}
        onClick={() => changeActiveNav(item.id)}
        variant={Number(activeNav) === item.id ? 'secondary' : 'ghost'}
        className="mb-2"
      >
        {item.title}
      </Button>
    ));
  }, [activeNav]);

  return { navContent, NavButtons };
}
