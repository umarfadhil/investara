"use client";

import { useCallback, useSyncExternalStore, type SetStateAction } from "react";

type CacheEntry<T> = {
  raw: string | null;
  value: T;
};

const listenersByKey = new Map<string, Set<() => void>>();
const cacheByKey = new Map<string, CacheEntry<unknown>>();

function emit(key: string) {
  listenersByKey.get(key)?.forEach((listener) => listener());
}

function subscribeToKey(key: string, listener: () => void) {
  const listeners = listenersByKey.get(key) ?? new Set<() => void>();
  listeners.add(listener);
  listenersByKey.set(key, listeners);

  function handleStorage(event: StorageEvent) {
    if (event.key === key) {
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useLocalStorageState<T>(
  key: string,
  fallback: T,
  parse: (value: unknown, fallback: T) => T,
) {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return fallback;
    }

    const raw = window.localStorage.getItem(key);
    const cached = cacheByKey.get(key) as CacheEntry<T> | undefined;

    if (cached?.raw === raw) {
      return cached.value;
    }

    if (!raw) {
      cacheByKey.set(key, { raw, value: fallback });
      return fallback;
    }

    try {
      const value = parse(JSON.parse(raw), fallback);
      cacheByKey.set(key, { raw, value });
      return value;
    } catch {
      window.localStorage.removeItem(key);
      cacheByKey.set(key, { raw: null, value: fallback });
      return fallback;
    }
  }, [fallback, key, parse]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);
  const subscribe = useCallback((listener: () => void) => subscribeToKey(key, listener), [key]);
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (nextValue: SetStateAction<T>) => {
      const currentValue = getSnapshot();
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (current: T) => T)(currentValue)
          : nextValue;
      const raw = JSON.stringify(resolvedValue);

      window.localStorage.setItem(key, raw);
      cacheByKey.set(key, { raw, value: resolvedValue });
      emit(key);
    },
    [getSnapshot, key],
  );

  return [value, setValue] as const;
}
