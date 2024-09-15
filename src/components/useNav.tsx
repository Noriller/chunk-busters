import { useState, useCallback } from 'react';

export function useNav() {
  const [activeNav, setActiveNav] = useState('nav1');

  const navItems = [
    { id: 'nav1', title: 'Navigation 1', content: 'Content for Navigation 1' },
    { id: 'nav2', title: 'Navigation 2', content: 'Content for Navigation 2' },
    { id: 'nav3', title: 'Navigation 3', content: 'Content for Navigation 3' },
    // Add more navigation items to demonstrate scrolling
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `nav${i + 4}`,
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

  const changeActiveNav = useCallback((id: string) => {
    if (navItems.find((item) => item.id === id)) {
      setActiveNav(id);
    }
  }, []);

  return { activeNav, changeActiveNav, navContent, navItems };
}
