import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { Button } from './ui/button';
import { useSearchParamsState } from './useSearchParamsState';

type SizeContext = {
  size: number | (() => number);
  SizeSwitcher: ReactNode;
};

const context = createContext<SizeContext>(null!);

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const Sizes = {
  '10': 1,
  '100': 2,
  '1_000': 3,
  '1_000_000': 6,
  chaotic: () => randomBetween(1, 6),
};

export function SizeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [size, setSize] = useSearchParamsState<keyof typeof Sizes>(
    'size',
    '100' as keyof typeof Sizes,
  );

  const SizeSwitcher = useMemo(() => {
    return (
      <div className="mt-4 flex gap-2">
        <Button
          variant={size === '10' ? 'secondary' : 'default'}
          onClick={() => setSize('10')}
        >
          10
        </Button>
        <Button
          variant={size === '100' ? 'secondary' : 'default'}
          onClick={() => setSize('100')}
        >
          100
        </Button>
        <Button
          variant={size === '1_000' ? 'secondary' : 'default'}
          onClick={() => setSize('1_000')}
        >
          1_000
        </Button>
        <Button
          variant={size === '1_000_000' ? 'secondary' : 'default'}
          onClick={() => setSize('1_000_000')}
        >
          1_000_000
        </Button>
        <Button
          variant={size === 'chaotic' ? 'secondary' : 'default'}
          onClick={() => setSize('chaotic')}
        >
          Chaotic
        </Button>
      </div>
    );
  }, [size]);

  const value = useMemo(
    () => ({
      size: Sizes[size] ?? Sizes[100],
      SizeSwitcher,
    }),
    [size],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
}

export function useSize() {
  return useContext(context);
}
