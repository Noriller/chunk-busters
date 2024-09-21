import { useCallback, useState } from 'react';

function useSearchParams(spName: string) {
  const getSp = () => new URLSearchParams(window.location.search);
  const get = () => getSp().get(spName);

  const set = useCallback(
    (value: string | null) => {
      const sp = getSp();
      if (value === null) {
        sp.delete(spName);
      } else {
        sp.set(spName, value);
      }

      window.history.pushState(
        {},
        '',
        `${window.location.pathname}?${sp.toString()}`,
      );
    },
    [spName],
  );

  return [get, set] as const;
}
export function useSearchParamsState<T extends string>(
  spName: string,
  defaultValue: string | null = null,
) {
  const [get, set] = useSearchParams(spName);
  const [state, setState] = useState(get() || defaultValue);
  const update = useCallback((value: string | null) => {
    setState(value as any);
    set(String(value));
  }, []);

  return [state, update] as [
    typeof defaultValue extends null ? T | null : T,
    typeof update,
  ];
}
