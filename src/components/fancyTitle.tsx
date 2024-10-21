import { useState, useEffect } from 'react';

const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateWavyPath = () => {
  let path = 'M 0 15 ';
  const width = window.innerWidth * 2;
  const steps = randomBetween(300, 500);
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y =
      randomBetween(10, 20) +
      Math.sin(randomBetween(i * 0.3, i * 0.7)) * randomBetween(1, 8) +
      Math.sin(randomBetween(i * 0.1, i * 0.7)) * randomBetween(1, 5);
    path += `L ${x} ${y} `;
  }
  return path;
};

function getHomeWithCurrentSearchParams() {
  const sp = new URLSearchParams(window.location.search);
  sp.delete('nav');
  return `${window.location.pathname}?${sp.toString()}`;
}

export function FancyTitle() {
  const [path, setPath] = useState(generateWavyPath());

  useEffect(() => {
    const interval = setInterval(() => {
      setPath(generateWavyPath());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block">
      <h1 className="relative inline-block text-center text-2xl font-bold xl:text-3xl">
        <a href={getHomeWithCurrentSearchParams()}>
          Chunk-Busters: Don't cross the streams
        </a>
        <span className="w-full">
          <svg width="100%" height="30" className="overflow-clip">
            <defs>
              <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff0000" />
                <stop offset="20%" stopColor="#ffff00" />
                <stop offset="40%" stopColor="#00ff00" />
                <stop offset="60%" stopColor="#00ffff" />
                <stop offset="80%" stopColor="#0000ff" />
                <stop offset="100%" stopColor="#ff00ff" />
              </linearGradient>
            </defs>
            <path
              d={path}
              fill="none"
              stroke="url(#rainbow)"
              strokeWidth="6"
              className="animate-rainbow-move"
            />
          </svg>
        </span>
      </h1>
    </div>
  );
}
