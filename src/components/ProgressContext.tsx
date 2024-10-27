import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isIndexValid, type Indexes } from './board/useBoards';
import { BorderedBox } from './bordered-box';
import { getActualSize } from './SizeContext';
import { Button } from './ui/button';
import { useSearchParamsState } from './useSearchParamsState';
import { ProgressButtonsGrid } from './ProgressButtons';

type Progress = Record<Indexes, number>;

export const initProgress: Progress = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
};

function useProgressValue() {
  const [current, setCurrent] = useState(initProgress);
  const [max, setMax] = useState(initProgress);
  const [defer, setDefer] = useSearchParamsState<'' | 'true'>('defer');
  const [extra, setExtra] = useSearchParamsState<'' | 'true'>('extra');
  const fakeProgress = useFakeProgress();

  const changeCurrent = useCallback(
    (board: number, value: number) => {
      if (isIndexValid(board)) {
        setCurrent((prev) => ({
          ...prev,
          [board]: value,
        }));
      }
    },
    [max],
  );

  const changeMax = useCallback((board: number, value: number) => {
    const size = getActualSize(value);
    if (isIndexValid(board)) {
      setMax((prev) => ({ ...prev, [board]: size }));
    }

    if (board === 0) {
      setMax(
        Object.fromEntries(
          Object.keys(initProgress).map((k) => [Number(k), size]),
        ) as Record<Indexes, number>,
      );
    }
  }, []);

  const addToMax = useCallback((board: number, value: number) => {
    if (isIndexValid(board)) {
      setMax((prev) => ({ ...prev, [board]: prev[board] + value }));
    }

    if (board === 0) {
      setMax(
        (old) =>
          Object.fromEntries(
            Object.entries(old).map(([k, size]) => [k, size + value]),
          ) as Record<Indexes, number>,
      );
    }
  }, []);

  const getProgress = useCallback(
    (board: number) => {
      if (isIndexValid(board)) {
        const progress = Math.floor((current[board] / max[board]) * 100);
        if (isNaN(progress)) {
          return fakeProgress[board];
        }
        return progress > 99 || progress < 0 ? 100 : progress;
      }
      return 0;
    },
    [current, max, fakeProgress],
  );

  const reset = useCallback(() => {
    setCurrent(initProgress);
  }, []);

  const useExtra = useCallback((bol: boolean) => {
    setExtra(bol ? 'true' : null);
  }, []);

  const ProgressSwitcher = useMemo(() => {
    return (
      <BorderedBox
        name="Progress Controls"
        description="Controls the progress border."
        className="flex flex-col gap-2"
      >
        <Button
          variant={defer === 'true' ? 'secondary' : 'default'}
          onClick={() => setDefer(defer === 'true' ? null : 'true')}
          className="flex flex-col p-6"
        >
          <span className="inline-block">
            Defer Progress Values: {defer === null ? 'ON' : 'OFF'}
          </span>
          <span className="inline-block">
            (ON for better performance, OFF for better UX)
          </span>
        </Button>

        {Boolean(extra) && <ProgressButtonsGrid />}
      </BorderedBox>
    );
  }, [defer, extra, max]);

  const value = useMemo(
    () => ({
      getProgress,
      changeCurrent,
      changeMax,
      addToMax,
      reset,
      defer: Boolean(defer),
      extra: Boolean(extra),
      ProgressSwitcher,
      useExtra,
    }),
    [
      changeCurrent,
      changeMax,
      addToMax,
      getProgress,
      reset,
      defer,
      extra,
      ProgressSwitcher,
      useExtra,
    ],
  );

  return value;
}

type ProgressContext = ReturnType<typeof useProgressValue>;

const context = createContext<ProgressContext>(null!);

/**
 * This context is used to track the progress of the API calls
 *
 * Changing the max values might end in a state it stop working
 * as it should, but it's not a big deal
 *
 * Normally it would get the max value that it's expected to receive
 * and the current count of values received and calculate the progress
 * that is then used in the progress border and if you can still change
 * the values on the fly
 */
export function ProgressContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useProgressValue();
  return <context.Provider value={value}>{children}</context.Provider>;
}

export function useProgress() {
  return useContext(context);
}

function useFakeProgress() {
  const [fake, setFake] = useState({
    0: Math.random() > 0.5 ? 100 : 0,
    1: Math.random() > 0.5 ? 100 : 0,
    2: Math.random() > 0.5 ? 100 : 0,
    3: Math.random() > 0.5 ? 100 : 0,
    4: Math.random() > 0.5 ? 100 : 0,
    5: Math.random() > 0.5 ? 100 : 0,
    6: Math.random() > 0.5 ? 100 : 0,
    7: Math.random() > 0.5 ? 100 : 0,
    8: Math.random() > 0.5 ? 100 : 0,
    9: Math.random() > 0.5 ? 100 : 0,
  } as Record<Indexes, number>);

  const [_target, setTarget] = useState({
    0: Math.random() > 0.5 ? 100 : 0,
    1: Math.random() > 0.5 ? 100 : 0,
    2: Math.random() > 0.5 ? 100 : 0,
    3: Math.random() > 0.5 ? 100 : 0,
    4: Math.random() > 0.5 ? 100 : 0,
    5: Math.random() > 0.5 ? 100 : 0,
    6: Math.random() > 0.5 ? 100 : 0,
    7: Math.random() > 0.5 ? 100 : 0,
    8: Math.random() > 0.5 ? 100 : 0,
    9: Math.random() > 0.5 ? 100 : 0,
  } as Record<Indexes, 0 | 100>);

  useEffect(() => {
    const interval = setInterval(() => {
      setFake((prev) => {
        setTarget((t) => {
          Array.from({ length: 9 }).forEach((_, i) => {
            if (Math.random() > 0.5) {
              return;
            }

            const index = (i + 1) as Indexes;
            const newVal =
              t[index] === 100 ? (prev[index] += 1) : (prev[index] -= 1);

            if (newVal < 1) {
              t[index] = 100;
            }

            if (newVal > 99) {
              t[index] = 0;
            }
          });

          return structuredClone(t);
        });
        return structuredClone(prev);
      });
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return fake;
}
