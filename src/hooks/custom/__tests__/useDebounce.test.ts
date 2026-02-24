import { renderHook, act } from '@testing-library/react-native';
import useDebounce from '../useDebounce';

describe('useDebounce', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should execute the callback after the specified delay', () => {
		const { result } = renderHook(() => useDebounce());
		const startDebounce = result.current;
		const callback = jest.fn();

		act(() => {
			startDebounce(callback, 500);
		});

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			jest.advanceTimersByTime(500);
		});

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should reset the timer if called repeatedly within the delay', () => {
		const { result } = renderHook(() => useDebounce());
		const startDebounce = result.current;
		const callback = jest.fn();

		act(() => {
			startDebounce(callback, 500);
		});

		act(() => {
			jest.advanceTimersByTime(200);
			// Call again, should reset timer
			startDebounce(callback, 500);
		});

		act(() => {
			jest.advanceTimersByTime(300);
		});

		// 200 + 300 = 500ms since first call, but only 300ms since second call.
		expect(callback).not.toHaveBeenCalled();

		act(() => {
			jest.advanceTimersByTime(200);
		});

		// 300 + 200 = 500ms since second call.
		expect(callback).toHaveBeenCalledTimes(1);
	});
});
