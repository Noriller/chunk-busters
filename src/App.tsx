import { FancyTitle } from './components/fancyTitle';
import { ProgressContextProvider } from './components/ProgressContext';
import { SizeContextProvider } from './components/SizeContext';
import { SpeedContextProvider } from './components/SpeedContext';
import { ScrollArea } from './components/ui/scroll-area';
import { useNav } from './components/useNav';

function BoardDemo() {
  const { navContent, NavButtons, Board } = useNav();

  return (
    <div className="block h-full min-h-screen bg-primary text-primary-foreground 2xl:flex 2xl:h-screen">
      <div className="w-full">
        <div className="h-full overflow-auto pr-6 max-2xl:pt-16 lg:overflow-hidden">
          <div className="left-0 top-0 z-10 w-full bg-primary pl-4 pt-4 max-2xl:fixed">
            <FancyTitle />
          </div>
          <ScrollArea className="h-full p-6 pt-10">
            <nav className="mb-4 flex flex-wrap gap-2">
              <NavButtons />
            </nav>
            <div className="prose prose-invert mt-4 min-w-full text-primary-foreground 2xl:pb-[10em]">
              {navContent}
            </div>
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

export default () => (
  <SizeContextProvider>
    <SpeedContextProvider>
      <ProgressContextProvider>
        <BoardDemo />
      </ProgressContextProvider>
    </SpeedContextProvider>
  </SizeContextProvider>
);
