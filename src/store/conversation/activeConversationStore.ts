import { create } from 'zustand';

type ActiveConversationState = {
	activeConversation: Patchwork.Conversations | undefined;
	actions: {
		saveActiveConversation: (
			conversation: Patchwork.Conversations | undefined,
		) => void;
		removeActiveConversation: () => void;
	};
};

export const useActiveConversationStore = create<ActiveConversationState>()(
	set => ({
		activeConversation: undefined,
		actions: {
			saveActiveConversation: activeConversation =>
				set(() => ({
					activeConversation,
				})),
			removeActiveConversation: () =>
				set(() => ({
					activeConversation: undefined,
				})),
		},
	}),
);

export const useGetActiveConversation = () =>
	useActiveConversationStore(state => state.activeConversation);

export const useActiveConversationActions = () =>
	useActiveConversationStore(state => state.actions);
