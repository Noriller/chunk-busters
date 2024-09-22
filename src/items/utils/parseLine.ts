import { type BoardLights, type Indexes, isIndexValid } from '@/components/board/useBoards';

export function parseLine(str: string) {
  const [board, light] = str.split(' ');
  return { board: Number(board), light: Number(light) };
}

type ParsedLine = ReturnType<typeof parseLine>;

type ParsedReturn = {
  result: ParsedLine[];
  remaining: string;
  done: boolean;
};


export function parseWholeString(str: string): ParsedReturn {
  if (!str || !str.includes('\n')) {
    return {
      result: [],
      remaining: str,
      done: str.length === 0,
    };
  }

  const separatorIndex = str.indexOf('\n');
  const line = str.slice(0, separatorIndex);
  const rest = str.slice(separatorIndex + 1);

  const { result, remaining, done } = parseWholeString(rest);
  return {
    result: [...result, parseLine(line)],
    remaining,
    done,
  };
}

export function accumulateValues(values: ParsedLine | ParsedLine[], init = {} as BoardLights) {
  const arr = Array.isArray(values) ? values : [values];

  return arr
    .map(({ board, light }) => {
      return [board, light];
    })
    .reduce((acc, [board, light]) => {
      if (!isIndexValid(board) || !isIndexValid(light)) {
        return acc;
      }
      if (acc[board]) {
        acc[board][light] = !acc[board][light];
      } else {
        acc[board] = { [light]: true } as BoardLights[typeof board];
      }
      return acc;

    }, init);
}

export type SetLights = React.Dispatch<React.SetStateAction<BoardLights>>;

export function parseAndToggleOnce(
  str: string,
  setLights: SetLights,
) {
  const parsed = parseWholeString(str).result;

  const values = accumulateValues(parsed);

  setLights((old) => {
    return {
      1: {
        ...old[1],
        ...values[1],
      },
      2: {
        ...old[2],
        ...values[2],
      },
      3: {
        ...old[3],
        ...values[3],
      },
      4: {
        ...old[4],
        ...values[4],
      },
      5: {
        ...old[5],
        ...values[5],
      },
      6: {
        ...old[6],
        ...values[6],
      },
      7: {
        ...old[7],
        ...values[7],
      },
      8: {
        ...old[8],
        ...values[8],
      },
      9: {
        ...old[9],
        ...values[9],
      },
    };
  });
}

export function parseToggleAndRemaining(
  str: string,
  setLights: SetLights,
  updateBoard: (board: number) => void
) {
  const { result, remaining } = parseWholeString(str);

  // trying to parse as many much as possible
  // was behaving unpredictably, so, changing
  // this to only toggle one "line" at a time
  const toggleOne = toggleOneLine(setLights, updateBoard);
  result.forEach(toggleOne);

  return remaining;
}

function toggleOneLine(setLights: SetLights, updateBoard: (board: number) => void) {
  return ({ board, light }: ParsedLine) => {

    if (!isIndexValid(board) || !isIndexValid(light)) {
      return;
    }

    updateBoard(board);

    setLights((old) => {
      return structuredClone({
        ...old,
        [board]: {
          ...old[board],
          [light]: !old[board][light],
        }
      });
    });
  };
}
