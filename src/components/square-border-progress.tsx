import { useDeferredValue, useMemo } from 'react';
import { useProgress } from './ProgressContext';

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
  const { getProgress, defer } = useProgress();
  const progressBase = getProgress(boardIndex);
  // defer the progress to avoid slowdown of the rest
  const progressDefer = useDeferredValue(progressBase);
  const progress = defer ? progressBase : progressDefer;

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
                background: isFilled
                  ? getRainbowColor(side, sidePosition, boardIndex)
                  : 'transparent',
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

function getRainbowColor(
  side: number,
  sidePosition: number,
  boardIndex: number,
) {
  // Calculate the position of this segment in the overall border
  const overallPosition = side * SEGMENTS_PER_SIDE + sidePosition;

  // Map this position to a hue value (0-360)
  // Red (0°/360°) → Orange (30°) → Yellow (60°)
  // → Green (120°) → Cyan (180°) → Blue (240°)
  // → Blue (240°) → Purple (270°) → Pink (300°)

  // each boardIndex will start with a different hue
  // then wrap around finishing the (0-360) range
  const hue = Math.floor(
    (boardIndex * 40 + (overallPosition / TOTAL_SEGMENTS) * 360) % 360,
  );

  // Use fixed saturation and lightness for vibrant colors
  return `hsl(${hue}, 100%, 70%)`;
}
