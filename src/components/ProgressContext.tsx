import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { isIndexValid, type Indexes } from './board/useBoards';

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
  progress: Progress;
  changeProgress: (index: Indexes, value: number) => void;
};

const context = createContext<ProgressContext>(null!);

export function ProgressContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(initProgress);

  const changeProgress = useCallback((index: Indexes, value: number) => {
    setProgress((prev) => ({ ...prev, [index]: value }));
  }, []);

  const value = useMemo(
    () => ({
      progress,
      changeProgress,
    }),
    [progress],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
}

export function useFullProgress() {
  return useContext(context);
}

export function useProgress(board: number) {
  const { progress, changeProgress } = useContext(context);

  if (!isIndexValid(board)) {
    return { progress: 0, setProgress: () => {} };
  }

  const progressForBoard = useMemo(() => progress[board], [progress, board]);
  const setProgressForBoard = useCallback(
    (value: number) => changeProgress(board, value),
    [changeProgress, board],
  );

  return {
    progress: progressForBoard,
    setProgress: setProgressForBoard,
  };
}
