import { Board } from './components/board';
import { FancyTitle } from './components/fancyTitle';
import { Button } from './components/ui/button';
import { ScrollArea } from './components/ui/scroll-area';
import { useNav } from './components/useNav';

export default function BoardDemo() {
  const { navItems, navContent, activeNav, changeActiveNav } = useNav();

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
                  onClick={() => changeActiveNav(item.id)}
                  variant={activeNav === item.id ? 'default' : 'outline'}
                  className="mb-2"
                >
                  {item.title}
                </Button>
              ))}
            </nav>
            <div className="mt-4 text-white">{navContent}</div>
          </ScrollArea>
        </div>
      </div>
      <div className="w-full max-2xl:max-w-[min(90vh,95vw)] max-2xl:p-8 2xl:m-4 2xl:mr-6 2xl:mt-0">
        <div className="mt-6 h-full max-h-[95vmin] max-w-[95vmin]">
          <Board />
        </div>
      </div>
    </div>
  );
}
