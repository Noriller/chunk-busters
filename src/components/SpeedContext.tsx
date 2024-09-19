import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
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
  fast: 10,
  slow: 100,
  chaotic: () => randomBetween(0, 100),
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
      <div className="mt-4 flex gap-2">
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
      </div>
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
