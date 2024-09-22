import { BorderProgress } from '../square-border-progress';
import { Led } from './led';
import { useRandomBoards } from './useBoards';

export function Board({ board = useRandomBoards() }) {
  return (
    <div className="rainbow-shadow relative z-0 aspect-square h-full">
      <div className="bg-wood grid h-full w-full grid-cols-3 grid-rows-3 gap-[2%] rounded-lg p-[2%]">
        {Object.entries(board).map(([boardIndex, mini], i) => (
          <BorderProgress boardIndex={Number(boardIndex)} key={boardIndex}>
            <MiniBoard lights={Object.values(mini)} />
          </BorderProgress>
        ))}
      </div>
    </div>
  );
}

function MiniBoard({ lights }: { lights: boolean[] }) {
  return (
    <div className="bg-circuit h-full w-full rounded-lg p-[4%]">
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-[10%]">
        {lights.map((on, i) => (
          <Led key={i} on={on} />
        ))}
      </div>
    </div>
  );
}
