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

  const getProgress = useCallback(
    (index: number) => {
      if (isIndexValid(index)) {
        return Math.floor((current[index] / max[index]) * 100);
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
  }, [defer, extra]);

  const value = useMemo(
    () => ({
      getProgress,
      changeCurrent,
      changeMax,
      reset,
      defer: Boolean(defer),
      extra: Boolean(extra),
      ProgressSwitcher,
      useExtra,
    }),
    [
      changeCurrent,
      changeMax,
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

function ProgressButtonsGrid() {
  const [speed, setSpeed] = useState(50);
  const [quantity, setQuantity] = useState(1000);

  const changeSpeed = (value: number) => () => {
    setSpeed(value);
  };

  const changeQuantity = (value: number) => () => {
    setQuantity(value);
  };

  return (
    <>
      <HorizontalDivider />

      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-4">
            <div>Quantity:</div>
            <Button
              variant={quantity === +1000 ? 'secondary' : 'default'}
              onClick={changeQuantity(+1000)}
            >
              +1000
            </Button>
            <Button
              variant={quantity === -1000 ? 'secondary' : 'default'}
              onClick={changeQuantity(-1000)}
            >
              -1000
            </Button>
          </div>
          <div className="flex justify-between gap-4">
            <div>Speed:</div>
            <Button
              variant={speed === +50 ? 'secondary' : 'default'}
              onClick={changeSpeed(+50)}
            >
              +50
            </Button>
            <Button
              variant={speed === -50 ? 'secondary' : 'default'}
              onClick={changeSpeed(-50)}
            >
              -50
            </Button>
          </div>
        </div>
        <div className="flex gap-4">
          <div>Change ALL</div>
          <div className="flex flex-col gap-4">
            <Button>Quantity {displayValue(quantity)}</Button>
            <Button>Speed {displayValue(speed)}</Button>
          </div>
        </div>
      </div>

      <HorizontalDivider />

      <div className="grid grid-cols-3 grid-rows-3 gap-2">
        {Object.keys(initProgress).map((k) => (
          <BoardButtons
            key={k}
            board={Number(k)}
            quantity={quantity}
            speed={speed}
          />
        ))}
      </div>
    </>
  );
}

const displayValue = (val: number) => `${val > 0 ? '+' : ''}${val}`;

function HorizontalDivider() {
  return <div className="my-2 h-[2px] bg-gray-300" />;
}

function BoardButtons({
  board,
  quantity,
  speed,
}: {
  board: number;
  quantity: number;
  speed: number;
}) {
  const { getProgress } = useProgress();

  const disabled = getProgress(board) > 99;

  return (
    <div className="flex justify-center gap-2">
      <Button variant="ghost" onClick={() => {}} disabled={disabled}>
        {board} | {displayValue(quantity)}
      </Button>
      <Button variant="ghost" onClick={() => {}} disabled={disabled}>
        {board} | {displayValue(speed)}
      </Button>
    </div>
  );
}