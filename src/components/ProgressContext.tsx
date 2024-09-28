import {
  createContext,
  useCallback,
  useContext,
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

type ProgressContext = {
  getProgress: (index: number) => number;
  changeCurrent: (index: number, value: number) => void;
  changeMax: (index: number, value: number) => void;
  addToMax: (index: number, value: number) => void;
  reset: () => void;
  defer: boolean;
  extra: boolean;
  ProgressSwitcher: React.ReactNode;
  useExtra: (bol: boolean) => void;
};

const context = createContext<ProgressContext>(null!);

export function ProgressContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(initProgress);
  const [max, setMax] = useState(initProgress);
  const [defer, setDefer] = useSearchParamsState<'' | 'true'>('defer');
  const [extra, setExtra] = useSearchParamsState<'' | 'true'>('extra');

  const changeCurrent = useCallback(
    (index: number, current: number) => {
      if (isIndexValid(index)) {
        setCurrent((prev) => ({
          ...prev,
          [index]: current,
        }));
      }
    },
    [max],
  );

  const changeMax = useCallback((index: number, value: number) => {
    const size = getActualSize(value);
    if (isIndexValid(index)) {
      setMax((prev) => ({ ...prev, [index]: size }));
    }

    if (index === 0) {
      setMax(
        Object.fromEntries(
          Object.keys(initProgress).map((k) => [Number(k), size]),
        ) as Record<Indexes, number>,
      );
    }
  }, []);

  const addToMax = useCallback((index: number, value: number) => {
    if (isIndexValid(index)) {
      setMax((prev) => ({ ...prev, [index]: prev[index] + value }));
    }

    if (index === 0) {
      setMax(
        (old) =>
          Object.fromEntries(
            Object.entries(old).map(([k, size]) => [k, size + value]),
          ) as Record<Indexes, number>,
      );
    }
  }, []);

  const getProgress = useCallback(
    (index: number) => {
      if (isIndexValid(index)) {
        const progress = Math.floor((current[index] / max[index]) * 100);
        return progress > 99 || isNaN(progress) ? 100 : progress;
      }
      return 0;
    },
    [current, max],
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

  return <context.Provider value={value}>{children}</context.Provider>;
}

export function useProgress() {
  return useContext(context);
}
