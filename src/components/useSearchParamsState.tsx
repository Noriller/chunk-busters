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

/**
 * Basically its a useState hook but in sync with the search params
 */
export function useSearchParamsState<T extends string | null>(
  spName: string,
  defaultValue: string | null = null,
) {
  const [get, set] = useSearchParams(spName);
  const [state, setState] = useState(get() || defaultValue);
  const update = useCallback(
    (value: T | ((old: T) => T) | null) => {
      setState((old) => {
        const newValue = typeof value === 'function' ? value(old as T) : value;
        set(newValue === null || newValue === '' ? null : newValue);
        return newValue;
      });
    },
    [state],
  );

  return [state, update] as [
    typeof defaultValue extends T ? T | null : T,
    typeof update,
  ];
}
