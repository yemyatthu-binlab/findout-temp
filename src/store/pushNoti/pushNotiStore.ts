import { create } from 'zustand';

type PushNotificationState = {
	fcmToken: string | null;
	notiCount: number;
	actions: {
		saveFcmToken: (token: string | null) => void;
		onSetNotifcationCount: (newNotiCount?: number) => void;
		onRemoveNotifcationCount: () => void;
	};
};

export const usePushNoticationStore = create<PushNotificationState>()(set => ({
	fcmToken: null,
	notiCount: 0,
	actions: {
		saveFcmToken: fcmToken => set({ fcmToken }),
		onSetNotifcationCount: (newNotiCount?: number) =>
			set(state => ({
				...state,
				notiCount: newNotiCount ? newNotiCount : ++state.notiCount,
			})),
		onRemoveNotifcationCount: () => set(state => ({ ...state, notiCount: 0 })),
	},
}));

export const usePushNoticationActions = () =>
	usePushNoticationStore(state => state.actions);
