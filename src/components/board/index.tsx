import { useEffect, useState } from 'react';
import { Led } from './led';

export function Board() {
  return (
    <div
      className={`w-full h-full bg-wood
      grid grid-cols-3 grid-rows-3
      gap-[2%] p-[2%] rounded-lg
    `}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <MiniBoard
          key={i}
          index={i}
        />
      ))}
    </div>
  );
}

// export function Board({ index = 0 }: { index?: number }) {
//   const random = () => Math.random() > 0.5;
//   const makeLights = () => Array.from({ length: 9 }, random);
//   const [lights, setLights] = useState(makeLights());

//   const randomIndex = () => Math.floor(Math.random() * 9);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const index = randomIndex();
//       setLights((lights) => {
//         lights[index] = !lights[index];
//         return [...lights];
//       });
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <InnerBoard index={index}>
//       {lights.map((on, i) => (
//         <Led
//           key={i}
//           on={on}
//         />
//       ))}
//     </InnerBoard>
//   );
// }

// function InnerBoard({
//   children,
//   index = 0,
// }: {
//   children: React.ReactNode;
//   index?: number;
// }) {
//   return (
//     <div
//       className={`inset-2 z-10
//       w-full h-full max-w-[50em] max-h-[50em]
//       flex items-center justify-center
//     `}
//     >
//       <div
//         style={{
//           // @ts-ignore
//           '--time': `${index + 20}s`,
//         }}
//         className={`rounded-lg bg-slate-600 p-[10em]
//                       grid gap-8 grid-cols-3 grid-rows-3`}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

function MiniBoard({ index }: { index: number }) {
  const random = () => Math.random() > 0.5;
  const makeLights = () => Array.from({ length: 9 }, random);
  const [lights, setLights] = useState(makeLights());

  const randomIndex = () => Math.floor(Math.random() * 9);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = randomIndex();
      setLights((lights) => {
        const newLights = [...lights];
        newLights[index] = !newLights[index];
        return newLights;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='w-full h-full bg-circuit rounded-lg p-[4%]'>
      <div className='w-full h-full grid grid-cols-3 grid-rows-3 gap-[10%]'>
        {lights.map((on, i) => (
          <Led
            key={i}
            on={on}
          />
        ))}
      </div>
    </div>
  );
}
