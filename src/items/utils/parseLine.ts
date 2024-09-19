import { type BoardLights, isIndexValid } from '@/components/board/useBoards';

export function parseLine(str: string) {
  const [board, light] = str.split(' ');
  return { board: Number(board), light: Number(light) };
}

export function parseWholeString(str: string): {
  result: { board: number; light: number; }[];
  remaining: string;
  done: boolean;
} {
  if (!str || !str.includes('\n')) {
    return {
      result: [],
      remaining: str,
      done: str.length === 0,
    };
  }

  const [line, ...rest] = str.split('\n');

  const { result, remaining, done } = parseWholeString(rest.join('\n'));
  return {
    result: [...result, parseLine(line)],
    remaining,
    done,
  };
}


export function parseAndToggleOnce(
  str: string,
  setLights: React.Dispatch<React.SetStateAction<BoardLights>>,
) {
  const parsed = parseWholeString(str)
    .result
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

    }, {} as BoardLights);

  setLights((old) => {
    return {
      1: {
        ...old[1],
        ...parsed[1],
      },
      2: {
        ...old[2],
        ...parsed[2],
      },
      3: {
        ...old[3],
        ...parsed[3],
      },
      4: {
        ...old[4],
        ...parsed[4],
      },
      5: {
        ...old[5],
        ...parsed[5],
      },
      6: {
        ...old[6],
        ...parsed[6],
      },
      7: {
        ...old[7],
        ...parsed[7],
      },
      8: {
        ...old[8],
        ...parsed[8],
      },
      9: {
        ...old[9],
        ...parsed[9],
      },
    };
  });
}