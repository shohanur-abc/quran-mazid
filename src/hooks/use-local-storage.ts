import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.log(error);
			return initialValue;
		}
	});

	const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => {
		try {
			setStoredValue((prev) => {
				const valueToStore = value instanceof Function ? value(prev) : value;
				if (typeof window !== "undefined") {
					window.localStorage.setItem(key, JSON.stringify(valueToStore));
					// Dispatch a custom event so other components can react
					window.dispatchEvent(new CustomEvent('local-storage-update', {
						detail: { key, newValue: valueToStore }
					}));
				}
				return valueToStore;
			});
		} catch (error) {
			console.log(error);
		}
	}, [key]);

	useEffect(() => {
		const handleStorageChange = (e: Event) => {
			const customEvent = e as CustomEvent;
			if (customEvent.detail && customEvent.detail.key === key) {
				setStoredValue(customEvent.detail.newValue);
			}
		};

		// Also listen to Native StorageEvent (cross-tab)
		const handleNativeStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				try {
					setStoredValue(JSON.parse(e.newValue));
				} catch (e) { }
			}
		};

		if (typeof window !== "undefined") {
			window.addEventListener('local-storage-update', handleStorageChange);
			window.addEventListener('storage', handleNativeStorageChange);

			return () => {
				window.removeEventListener('local-storage-update', handleStorageChange);
				window.removeEventListener('storage', handleNativeStorageChange);
			};
		}
	}, [key]);

	return [storedValue, setValue];
}

