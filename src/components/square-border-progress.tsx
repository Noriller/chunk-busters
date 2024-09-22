import { useState, useMemo, useEffect } from 'react';
import { useProgress } from './ProgressContext';
import type { Indexes } from './board/useBoards';

// Number of segments per side of the square
const SEGMENTS_PER_SIDE = 25;
// Total number of segments
const TOTAL_SEGMENTS = SEGMENTS_PER_SIDE * 4;

export function BorderProgress({
  children,
  boardIndex,
}: {
  children: React.ReactNode;
  boardIndex: number;
}) {
  const { progress } = useProgress(boardIndex);

  const borderSegments = useMemo(() => {
    const segments = [];
    const filledSegments = Math.floor((progress / 100) * TOTAL_SEGMENTS);

    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
      const side = Math.floor(i / SEGMENTS_PER_SIDE);
      const sidePosition = i % SEGMENTS_PER_SIDE;
      const isFilled = i < filledSegments;

      segments.push({ side, sidePosition, isFilled });
    }

    return segments;
  }, [progress]);

  return (
    <div className="overflow-clip rounded-lg">
      <div className="relative h-full w-full p-[1%]">
        {borderSegments.map(({ side, sidePosition, isFilled }, index) => {
          const style = makeStyle(side, sidePosition);

          return (
            <div
              key={index}
              className={`absolute blur-[8px]`}
              style={{
                width: '1em',
                height: '1em',
                ...style,
                background: isFilled ? randomColor() : 'transparent',
              }}
            />
          );
        })}

        {children}
      </div>
    </div>
  );
}
function makeStyle(side: number, sidePosition: number) {
  switch (side) {
    // Top
    case 0:
      return {
        top: 0,
        left: `${(sidePosition / SEGMENTS_PER_SIDE) * 100}%`,
      };
    // Right
    case 1:
      return {
        top: `${(sidePosition / SEGMENTS_PER_SIDE) * 100}%`,
        right: 0,
      };
    // Bottom
    case 2:
      return {
        bottom: 0,
        right: `${(sidePosition / SEGMENTS_PER_SIDE) * 100}%`,
      };
    // Left
    case 3:
      return {
        bottom: `${(sidePosition / SEGMENTS_PER_SIDE) * 100}%`,
        left: 0,
      };

    default:
      return {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };
  }
}

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
