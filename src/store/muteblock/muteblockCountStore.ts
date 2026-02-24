import { create } from 'zustand';

interface MuteBlockCountState {
	mutedAccountsCount: number;
	blockedAccountsCount: number;
	actions: {
		onSetMutedAccountCount: (count: number) => void;
		onSetBlockedAccountCount: (count: number) => void;
	};
}

export const useMuteBlockCountStore = create<MuteBlockCountState>()(set => ({
	mutedAccountsCount: 0,
	blockedAccountsCount: 0,
	actions: {
		onSetMutedAccountCount: count =>
			set(state => ({ ...state, mutedAccountsCount: count })),
		onSetBlockedAccountCount: count =>
			set(() => ({ blockedAccountsCount: count })),
	},
}));

export const useMuteBlockCountActions = () =>
	useMuteBlockCountStore(state => state.actions);
