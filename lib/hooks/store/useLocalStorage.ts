"use client"

import { type SetStateAction, useCallback, useSyncExternalStore } from "react"

const LOCAL_STORAGE_EVENT = "ankh-hooks:local-storage"

/** Persist JSON-serializable React state in browser local storage. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialSnapshot = serializeValue(initialValue)

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined") return () => undefined

      const handleStorage = (event: StorageEvent) => {
        if (event.storageArea === window.localStorage && event.key === key) onStoreChange()
      }
      const handleLocalStorage = (event: Event) => {
        if ((event as CustomEvent<string>).detail === key) onStoreChange()
      }

      window.addEventListener("storage", handleStorage)
      window.addEventListener(LOCAL_STORAGE_EVENT, handleLocalStorage)
      return () => {
        window.removeEventListener("storage", handleStorage)
        window.removeEventListener(LOCAL_STORAGE_EVENT, handleLocalStorage)
      }
    },
    [key],
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return initialSnapshot

    try {
      return window.localStorage.getItem(key) ?? initialSnapshot
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialSnapshot
    }
  }, [initialSnapshot, key])

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => initialSnapshot)
  const storedValue = parseSnapshot(snapshot, initialValue, key)

  const setValue = useCallback(
    (value: SetStateAction<T>) => {
      if (typeof window === "undefined") return

      const previousValue = parseSnapshot(getSnapshot(), initialValue, key)
      const nextValue =
        typeof value === "function"
          ? (value as (previousValue: T) => T)(previousValue)
          : value

      try {
        window.localStorage.setItem(key, serializeValue(nextValue))
        window.dispatchEvent(new window.CustomEvent(LOCAL_STORAGE_EVENT, { detail: key }))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [getSnapshot, initialValue, key],
  )

  return [storedValue, setValue] as const
}

function parseSnapshot<T>(snapshot: string, initialValue: T, key: string): T {
  try {
    return JSON.parse(snapshot) as T
  } catch (error) {
    console.warn(`Error parsing localStorage key "${key}":`, error)
    return initialValue
  }
}

function serializeValue<T>(value: T): string {
  const serializedValue = JSON.stringify(value)
  if (serializedValue === undefined) throw new TypeError("Value is not JSON serializable")
  return serializedValue
}
