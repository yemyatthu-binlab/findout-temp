import { renderHook, act } from '@testing-library/react-native';
import { AppState, AppStateStatus } from 'react-native';
import { verifyAuthToken } from '@/services/auth.service';
import { useAuthStoreAction } from '@/store/auth/authStore';
import useAuthRevalidationOnAppReturn from '../useAuthRevalidationOnAppReturn';

// Mock AsyncStorage to fix "NativeModule: AsyncStorage is null" error
jest.mock('@react-native-async-storage/async-storage', () =>
	require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock Clipboard
jest.mock('@react-native-clipboard/clipboard', () => ({
	setString: jest.fn(),
	getString: jest.fn(),
}));

// Mock auth service to avoid importing real dependencies
jest.mock('@/services/auth.service', () => ({
	verifyAuthToken: jest.fn(),
}));

// Mock auth store
jest.mock('@/store/auth/authStore', () => ({
	useAuthStoreAction: jest.fn(),
}));

describe('useAuthRevalidationOnAppReturn', () => {
	const mockHandleClearAuth = jest.fn();
	const mockSetUserInfo = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useAuthStoreAction as jest.Mock).mockReturnValue({
			setUserInfo: mockSetUserInfo,
		});
		(verifyAuthToken as jest.Mock).mockResolvedValue({});

		// Ensure AppState.currentState is a string
		// @ts-ignore
		AppState.currentState = 'active';
	});

	it('should revalidate auth token when app returns to active state', async () => {
		const mockUserInfo = { acct: 'user@example.com' };
		(verifyAuthToken as jest.Mock).mockResolvedValue(mockUserInfo);

		let appStateCallback: (state: AppStateStatus) => void;
		const addEventListenerSpy = jest
			.spyOn(AppState, 'addEventListener')
			.mockImplementation(((event: string, callback: any) => {
				appStateCallback = callback;
				return { remove: jest.fn() };
			}) as any);

		renderHook(() => useAuthRevalidationOnAppReturn(mockHandleClearAuth));

		await act(async () => {
			if (appStateCallback) await appStateCallback('background');
		});

		await act(async () => {
			if (appStateCallback) await appStateCallback('active');
		});

		expect(verifyAuthToken).toHaveBeenCalled();
		expect(mockSetUserInfo).toHaveBeenCalledWith(mockUserInfo);
		expect(mockHandleClearAuth).not.toHaveBeenCalled();

		addEventListenerSpy.mockRestore();
	});

	it('should call handleClearAuth if userInfo is missing acct', async () => {
		const mockUserInfo = { acct: null };
		(verifyAuthToken as jest.Mock).mockResolvedValue(mockUserInfo);

		let appStateCallback: (state: AppStateStatus) => void;
		jest.spyOn(AppState, 'addEventListener').mockImplementation(((
			event: string,
			callback: any,
		) => {
			appStateCallback = callback;
			return { remove: jest.fn() };
		}) as any);

		renderHook(() => useAuthRevalidationOnAppReturn(mockHandleClearAuth));

		await act(async () => {
			if (appStateCallback) await appStateCallback('background');
		});

		await act(async () => {
			if (appStateCallback) await appStateCallback('active');
		});

		expect(verifyAuthToken).toHaveBeenCalled();
		expect(mockHandleClearAuth).toHaveBeenCalled();
	});

	it('should call handleClearAuth if verifyAuthToken throws error', async () => {
		(verifyAuthToken as jest.Mock).mockRejectedValue(new Error('Auth failed'));

		let appStateCallback: (state: AppStateStatus) => void;
		jest.spyOn(AppState, 'addEventListener').mockImplementation(((
			event: string,
			callback: any,
		) => {
			appStateCallback = callback;
			return { remove: jest.fn() };
		}) as any);

		renderHook(() => useAuthRevalidationOnAppReturn(mockHandleClearAuth));

		await act(async () => {
			if (appStateCallback) await appStateCallback('background');
		});

		await act(async () => {
			if (appStateCallback) await appStateCallback('active');
		});

		expect(verifyAuthToken).toHaveBeenCalled();
		expect(mockHandleClearAuth).toHaveBeenCalled();
	});
});
