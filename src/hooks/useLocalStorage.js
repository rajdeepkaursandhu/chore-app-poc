import { useState, useEffect } from 'react';

/**
 * A generic hook that syncs React state to localStorage.
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The default value if no stored value exists
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.warn(`[useLocalStorage] Error writing key "${key}":`, err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
