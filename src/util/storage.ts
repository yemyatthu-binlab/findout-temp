import EncryptedStorage from 'react-native-encrypted-storage';
import { removeHttps } from './helper/helper';
import { Appearance } from 'react-native';
import { ILanguage } from '@/store/feed/languageStore';
import { DEFAULT_API_URL } from './constant';

const MULTI_AUTH_KEY = 'MULTI_AUTH_STATE';

type UserInfo = {
	username: string;
	displayName: string;
	avatar: string;
};

export type AuthState = {
	access_token: string;
	domain: string;
	userInfo: UserInfo;
	theme?: 'dark' | 'light';
	locale?: ILanguage;
};

export const defaultAuthState: AuthState = {
	access_token: '',
	domain: process.env.API_URL ?? DEFAULT_API_URL,
	userInfo: {
		username: '',
		displayName: '',
		avatar: '',
	},
	theme: Appearance.getColorScheme() ?? 'light',
	locale: 'en',
};

export type MultiAccountState = {
	accounts: Record<string, AuthState>;
	activeId?: string;
};

export const getAccountId = (authState: AuthState): string => {
	const username = authState.userInfo?.username?.trim();
	const domain = removeHttps(authState.domain);

	// noted: in case, for edge cases
	if (!username) {
		return `pending@${domain}`;
	}

	return `${username}@${domain}`;
};

// auth states
export const getMultiAuthState = async (): Promise<MultiAccountState> => {
	try {
		const state = await EncryptedStorage.getItem(MULTI_AUTH_KEY);
		return state ? (JSON.parse(state) as MultiAccountState) : { accounts: {} };
	} catch (err) {
		console.error('Failed to load multi auth state', err);
		return { accounts: {} };
	}
};

export const saveMultiAuthState = async (state: MultiAccountState) => {
	try {
		await EncryptedStorage.setItem(MULTI_AUTH_KEY, JSON.stringify(state));
	} catch (err) {
		console.error('Failed to save multi auth state', err);
	}
};

export const getActiveAuthState = async (): Promise<AuthState> => {
	const state = await getMultiAuthState();
	if (state?.activeId && state.accounts[state.activeId]) {
		return state.accounts[state.activeId];
	}
	return defaultAuthState;
};

// functions
export const addOrUpdateAccount = async (
	newAuthState: AuthState,
	makeActive = true,
) => {
	try {
		const accountId = getAccountId(newAuthState);
		const currentState = (await getMultiAuthState()) ?? { accounts: {} };

		const existingAccount = currentState.accounts[accountId];
		const systemTheme = Appearance.getColorScheme() ?? 'light';

		const updatedAuthState: AuthState = {
			...newAuthState,
			theme: newAuthState.theme ?? existingAccount?.theme ?? systemTheme,
			locale: newAuthState.locale ?? existingAccount?.locale ?? 'en',
		};

		// noted: max acc is up to 6 with first in last out system
		const accountIds = Object.keys(currentState.accounts);
		if (!existingAccount && accountIds.length >= 6) {
			let oldestAccountId = accountIds[0];
			if (oldestAccountId === currentState.activeId) {
				// noted: skipped deleting the active acc
				oldestAccountId =
					accountIds.find(id => id !== currentState.activeId) ??
					oldestAccountId;
			}
			delete currentState.accounts[oldestAccountId];
		}

		const newState: MultiAccountState = {
			...currentState,
			accounts: {
				...currentState.accounts,
				[accountId]: updatedAuthState,
			},
			activeId: makeActive ? accountId : currentState.activeId,
		};

		await saveMultiAuthState(newState);
	} catch (err) {
		console.error('Failed to add or update account', err);
	}
};

export const switchActiveAccount = async (accountId: string | null) => {
	const state = await getMultiAuthState();
	if (accountId === null) {
		state.activeId = undefined;
		await saveMultiAuthState(state);
		return;
	}
	if (!state || !state.accounts[accountId]) {
		console.error('Attempted to switch to a non-existent account.');
		return;
	}
	state.activeId = accountId;
	await saveMultiAuthState(state);
};

export const removeAccount = async (accountId: string) => {
	const state = await getMultiAuthState();
	if (!state || !state.accounts[accountId]) return;

	delete state.accounts[accountId];

	// noted: clear the activeId if the removed account was active
	// used for delete account logic
	if (state.activeId === accountId) {
		state.activeId = undefined;
	}

	await saveMultiAuthState(state);
};
