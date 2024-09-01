export function Led({ on = false }) {
  return (
    <div className={`led-light h-full w-full rounded-full`} data-state={on} />
  );
}
