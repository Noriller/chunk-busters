import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { BorderedBox } from './bordered-box';
import { Button } from './ui/button';
import { useSearchParamsState } from './useSearchParamsState';

type SpeedContext = {
  speed: number | (() => number);
  SpeedSwitcher: ReactNode;
};

const context = createContext<SpeedContext>(null!);

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const Speeds = {
  // 1 is the lowest I could go without
  // blocking the browser, and even then
  // it still might lag too much sometimes
  ultraFast: 1,
  fast: 10,
  slow: 100,
  verySlow: 1000,
  chaotic: () => randomBetween(0, 200),
};

export function SpeedContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [speed, setSpeed] = useSearchParamsState<keyof typeof Speeds>(
    'speed',
    'fast' as keyof typeof Speeds,
  );

  const SpeedSwitcher = useMemo(() => {
    return (
      <BorderedBox
        name="Speed Controls"
        description="Controls the speed of which the API will send chunks (too fast and it might lag too much)"
      >
        <Button
          variant={speed === 'fast' ? 'secondary' : 'default'}
          onClick={() => setSpeed('fast')}
        >
          Fast API
        </Button>
        <Button
          variant={speed === 'slow' ? 'secondary' : 'default'}
          onClick={() => setSpeed('slow')}
        >
          Slow API
        </Button>
        <Button
          variant={speed === 'chaotic' ? 'secondary' : 'default'}
          onClick={() => setSpeed('chaotic')}
        >
          Chaotic API
        </Button>
        <Button
          variant={speed === 'ultraFast' ? 'secondary' : 'default'}
          onClick={() => setSpeed('ultraFast')}
        >
          UltraFast
        </Button>
        <Button
          variant={speed === 'verySlow' ? 'secondary' : 'default'}
          onClick={() => setSpeed('verySlow')}
        >
          Very Slow
        </Button>
      </BorderedBox>
    );
  }, [speed]);

  const value = useMemo(
    () => ({
      speed: Speeds[speed] ?? Speeds.fast,
      SpeedSwitcher,
    }),
    [speed],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
}

export function useSpeed() {
  return useContext(context);
}
