import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { verifyAuthToken } from '@/services/auth.service';
import { useAuthStoreAction } from '@/store/auth/authStore';

const useAuthRevalidationOnAppReturn = (handleClearAuth: () => void) => {
	const appState = useRef<AppStateStatus>(AppState.currentState);
	const { setUserInfo } = useAuthStoreAction();

	useEffect(() => {
		const handleAppStateChange = async (nextAppState: AppStateStatus) => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === 'active'
			) {
				try {
					const userInfo = await verifyAuthToken();
					if (userInfo) {
						setUserInfo(userInfo);
					}
					if (!userInfo?.acct) {
						await handleClearAuth();
					}
				} catch {
					await handleClearAuth();
				}
			}
			appState.current = nextAppState;
		};

		const subscription = AppState.addEventListener(
			'change',
			handleAppStateChange,
		);

		return () => subscription.remove();
	}, []);
};

export default useAuthRevalidationOnAppReturn;
