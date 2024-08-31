// export function Led({ on = false }) {
//   return (
//     <div
//       className='led-light'
//       data-state={on}
//     />
//   );
// }
export function Led({ on = false }) {
  return (
    <div
      className={`w-full h-full rounded-full ${on ? 'green' : 'red'} led-light`}
      data-state={on}
    />
  );
}
