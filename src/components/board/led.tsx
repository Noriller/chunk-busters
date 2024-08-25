export function Led({ on = false }) {
  return (
    <div
      className='led-light'
      data-state={on}
    />
  );
}
