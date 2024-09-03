export function Led({ on = false }) {
  return (
    <div
      className="led-light h-full w-full rounded-full data-[state=true]:led-green data-[state=false]:led-red data-[state=false]:animate-red-pulse data-[state=true]:animate-green-pulse"
      data-state={on}
    />
  );
}
