import { usePostToApi } from '@/items/utils/fetch';
import { initProgress, useProgress } from './ProgressContext';
import { Button } from './ui/button';

export function ProgressButtonsGrid() {
  const post = usePostToApi();
  return (
    <>
      <HorizontalDivider />

      <div>Change ALL</div>
      <div className="flex gap-4">
        <div className="flex gap-4">
          <Button
            onClick={() => post({ api: 0, key: 'quantity', value: +1000 })}
          >
            Quantity +1000
          </Button>
          <Button
            onClick={() => post({ api: 0, key: 'quantity', value: -1000 })}
          >
            Quantity -1000
          </Button>
        </div>
        <VerticalDivider />
        <div className="flex gap-4">
          <Button onClick={() => post({ api: 0, key: 'speed', value: +50 })}>
            Speed +50
          </Button>
          <Button onClick={() => post({ api: 0, key: 'speed', value: -50 })}>
            Speed -50
          </Button>
        </div>
      </div>

      <HorizontalDivider />

      <div>Change Boards (quantity | speed)</div>
      <div className="grid grid-cols-3 grid-rows-3 gap-2">
        {Object.keys(initProgress).map((k) => (
          <BoardButtons key={k} board={Number(k)} />
        ))}
      </div>
    </>
  );
}

function HorizontalDivider() {
  return <div className="my-2 h-[2px] bg-gray-300" />;
}

function VerticalDivider() {
  return <div className="my-2 w-[2px] bg-gray-300" />;
}

function BoardButtons({ board }: { board: number }) {
  const { getProgress } = useProgress();
  const post = usePostToApi();

  const disabled = getProgress(board) > 99;

  return (
    <div className="flex justify-center gap-2 rounded-md border-2 border-gray-300 p-2">
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => post({ api: board, key: 'quantity', value: +1000 })}
          disabled={disabled}
        >
          {board} | +1000
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => post({ api: board, key: 'quantity', value: -1000 })}
          disabled={disabled}
        >
          {board} | -1000
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => post({ api: board, key: 'speed', value: +50 })}
          disabled={disabled}
        >
          {board} | +50
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => post({ api: board, key: 'speed', value: -50 })}
          disabled={disabled}
        >
          {board} | -50
        </Button>
      </div>
    </div>
  );
}
