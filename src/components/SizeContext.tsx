import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { Button } from './ui/button';
import { useSearchParamsState } from './useSearchParamsState';
import { BorderedBox } from './bordered-box';


function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const Sizes = {
  '10': 1,
  '100': 2,
  '1_000': 3,
  '10_000': 4,
  // big numbers like this will generate GBs of data
  // (this happens because of the "padding" added to the strings)
  // in the normal `await json`, the browser WILL run out of memory
  // but even streaming I had problems with it
  // this is most likely because of some memory leak
  // since this is a demo, I won't worry about it
  // I did try to find the source of it, but I couldn't find it
  '100_000': 5,
  '1_000_000': 6,
  chaotic: () => randomBetween(1, 6),
};

function useSizeValue() {
  const [size, setSize] = useSearchParamsState<keyof typeof Sizes>(
    'size',
    '100' as keyof typeof Sizes,
  );

  const SizeSwitcher = useMemo(() => {
    return (
      <BorderedBox
        name="Size Controls"
        description="Controls how many items the API will send (too many and you'll end without RAM)"
      >
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
          variant={size === '10_000' ? 'secondary' : 'default'}
          onClick={() => setSize('10_000')}
        >
          10_000
        </Button>
        <Button
          variant={size === '100_000' ? 'secondary' : 'default'}
          onClick={() => setSize('100_000')}
        >
          100_000
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
      </BorderedBox>
    );
  }, [size]);

  const value = useMemo(
    () => ({
      size: Sizes[size] ?? Sizes[100],
      SizeSwitcher,
    }),
    [size],
  );

  return value;
}

type SizeContext = ReturnType<typeof useSizeValue>;

const context = createContext<SizeContext>(null!);

export function SizeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useSizeValue();
  return <context.Provider value={value}>{children}</context.Provider>;
}

export function useSize() {
  return useContext(context);
}

export function getActualSize(n: number) {
  return Number(eval(`1e${n}`));
}
