import { useState } from 'react';
import { Board } from './components/board';
import { FancyTitle } from './components/fancyTitle';
import { Button } from './components/ui/button';
import { ScrollArea } from './components/ui/scroll-area';

export default function BoardDemo() {
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

  return (
    <div className="block h-full min-h-screen bg-gray-900 text-white 2xl:flex 2xl:h-screen">
      <div className="w-full">
        <div className="h-full overflow-auto pr-6 max-2xl:pt-16 lg:overflow-hidden">
          <div className="left-0 top-0 z-10 w-full bg-gray-900 pl-4 pt-4 max-2xl:fixed">
            <FancyTitle />
          </div>
          <ScrollArea className="h-full p-6 pt-10">
            <nav className="mb-4 flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  variant={activeNav === item.id ? 'default' : 'outline'}
                  className="mb-2"
                >
                  {item.title}
                </Button>
              ))}
            </nav>
            <div className="mt-4 text-white">
              {navItems.find((item) => item.id === activeNav)?.content}
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
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className="w-full max-2xl:max-w-[min(90vh,95vw)] max-2xl:p-8 2xl:m-4 2xl:mr-6 2xl:mt-0">
        <div className="mt-4 h-full max-h-[95vmin] max-w-[95vmin]">
          <Board />
        </div>
      </div>
    </div>
  );
}
