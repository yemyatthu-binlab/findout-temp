import { useRef } from 'react';

const useDebounce = () => {
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

	const startDebounce = (taskAfterTimeout: () => void, debounceTime = 1000) => {
		clearDebounce();
		debounceTimeout.current = setTimeout(() => {
			taskAfterTimeout();
		}, debounceTime);
	};

	const clearDebounce = () => {
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
			debounceTimeout.current = null;
		}
	};

	return startDebounce;
};

export default useDebounce;
