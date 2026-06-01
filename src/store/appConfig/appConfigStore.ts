import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppConfigInfo {
	appId: string;
	userId: string;
	appToken: string;
	appName: string;
	baseUrl: string;
	hostingType: string;
	clientId?: string;
	clientSecret?: string;
}

interface AppConfigState {
	isAppScanned: boolean;
	activeAppInfo: AppConfigInfo | null;
	fullConfig: Record<string, any> | null;
	actions: {
		setAppConfig: (
			token: string,
			appId: string,
			userId: string,
			apiResponse: any,
			clientId?: string,
			clientSecret?: string,
		) => void;
		clearAppConfig: () => void;
	};
}

export const useAppConfigStore = create<AppConfigState>()(
	persist(
		set => ({
			isAppScanned: false,
			activeAppInfo: null,
			fullConfig: null,
			actions: {
				setAppConfig: (
					token,
					appId,
					userId,
					apiResponse,
					clientId,
					clientSecret,
				) => {
					let baseUrl = '';
					let hostingType = '';
					let serverName = '';
					let appName = apiResponse?.data?.Branding[0]?.appName || 'Patchwork';

					const communitySetting = apiResponse?.data?.CommunitySetting?.[0];
					if (communitySetting) {
						hostingType = communitySetting.hostingType;
						serverName = communitySetting.serverName;

						if (hostingType === 'NEWSMAST_HOSTED') {
							baseUrl = `https://${serverName}.channel.org`;
						} else {
							baseUrl = serverName.startsWith('https://')
								? serverName
								: `https://${serverName}`;
						}
					}

					set({
						isAppScanned: true,
						fullConfig: apiResponse,
						activeAppInfo: {
							appId,
							userId,
							appToken: token,
							appName,
							baseUrl,
							hostingType,
							clientId,
							clientSecret,
						},
					});
				},
				clearAppConfig: () =>
					set({
						isAppScanned: false,
						activeAppInfo: null,
						fullConfig: null,
					}),
			},
		}),
		{
			name: 'app-config-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: state => ({
				isAppScanned: state.isAppScanned,
				activeAppInfo: state.activeAppInfo,
				fullConfig: state.fullConfig,
			}),
		},
	),
);

export const useAppConfigActions = () =>
	useAppConfigStore(state => state.actions);
