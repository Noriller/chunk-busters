import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { isIndexValid, type Indexes } from './board/useBoards';
import { getActualSize } from './SizeContext';

type Progress = Record<Indexes, number>;

const initProgress: Progress = {
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
};

const context = createContext<ProgressContext>(null!);

export function ProgressContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(initProgress);
  const [max, setMax] = useState(initProgress);

  const changeCurrent = useCallback(
    (index: number, current: number) => {
      if (isIndexValid(index)) {
        setCurrent((prev) => ({
          ...prev,
          [index]: max[index] ? current % max[index] : current,
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

  const getProgress = useCallback(
    (index: number) => {
      if (isIndexValid(index)) {
        return Math.floor((current[index] / max[index]) * 100);
      }
      return 0;
    },
    [current, max],
  );

  const value = useMemo(
    () => ({
      getProgress,
      changeCurrent,
      changeMax,
    }),
    [changeCurrent, changeMax, getProgress],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
}

export function useProgress() {
  return useContext(context);
}
