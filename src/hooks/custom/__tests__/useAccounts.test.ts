import { renderHook } from '@testing-library/react-native';
import { useAccounts } from '../useAccounts';

const mockUseAccountsStore = jest.fn();
jest.mock('@/store/auth/accountsStore', () => ({
	useAccountsStore: (selector: any) => selector(mockUseAccountsStore()),
}));

describe('useAccounts', () => {
	beforeEach(() => {
		mockUseAccountsStore.mockReset();
	});

	it('should return default values when store is empty', () => {
		mockUseAccountsStore.mockReturnValue({
			accounts: [],
			activeAccId: null,
			fetchAccounts: jest.fn(),
		});

		const { result } = renderHook(() => useAccounts());

		expect(result.current.accounts).toEqual([]);
		expect(result.current.activeAccId).toBeNull();
		expect(result.current.fetchAccounts).toBeDefined();
	});

	it('should return populated accounts and active ID', () => {
		const mockAccounts = [
			{ id: '1', username: 'user1' },
			{ id: '2', username: 'user2' },
		];
		const mockFetch = jest.fn();

		mockUseAccountsStore.mockReturnValue({
			accounts: mockAccounts,
			activeAccId: '2',
			fetchAccounts: mockFetch,
		});

		const { result } = renderHook(() => useAccounts());

		expect(result.current.accounts).toEqual(mockAccounts);
		expect(result.current.activeAccId).toBe('2');
		expect(result.current.fetchAccounts).toBe(mockFetch);
	});
});
