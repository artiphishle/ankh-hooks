"use client"

import { type SetStateAction, useCallback, useEffect, useRef, useState } from "react"

/** Persist React state in browser local storage and synchronize external storage changes. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialValueRef = useRef(initialValue)
  const valueRef = useRef(initialValue)
  const [storedValue, setStoredValue] = useState(initialValue)

  useEffect(() => {
    if (typeof window === "undefined") return

    const syncValue = (serializedValue: string | null) => {
      const nextValue = readStoredValue(key, serializedValue, initialValueRef.current)
      valueRef.current = nextValue
      setStoredValue(nextValue)
    }

    try {
      syncValue(window.localStorage.getItem(key))
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || event.key !== key) return
      syncValue(event.newValue)
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [key])

  const setValue = useCallback(
    (value: SetStateAction<T>) => {
      const nextValue =
        typeof value === "function"
          ? (value as (previousValue: T) => T)(valueRef.current)
          : value

      valueRef.current = nextValue
      setStoredValue(nextValue)

      if (typeof window === "undefined") return

      try {
        const serializedValue = JSON.stringify(nextValue)
        if (serializedValue === undefined) throw new TypeError("Value is not JSON serializable")
        window.localStorage.setItem(key, serializedValue)
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key],
  )

  return [storedValue, setValue] as const
}

function readStoredValue<T>(key: string, serializedValue: string | null, initialValue: T): T {
  if (serializedValue === null) return initialValue

  try {
    return JSON.parse(serializedValue) as T
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return initialValue
  }
}
