import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialize from storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [key])

  const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
        return valueToStore
      })
    } catch (error) {
      console.log(error)
    }
  }, [key])

  return [storedValue, setValue]
}
