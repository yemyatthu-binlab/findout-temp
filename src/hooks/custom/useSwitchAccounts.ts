import { useAccountsStore } from '@/store/auth/accountsStore';

export const useSwitchAccounts = () => {
	const accounts = useAccountsStore(state => state.accounts);
	const activeAccId = useAccountsStore(state => state.activeAccId);
	const fetchAccounts = useAccountsStore(state => state.fetchAccounts);
	return { accounts, activeAccId, fetchAccounts };
};
