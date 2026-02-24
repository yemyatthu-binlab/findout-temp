import { Ref, RefObject } from 'react';
import { TextInput } from 'react-native';
import { Asset } from 'react-native-image-picker';
import { create } from 'zustand';

type StatusReplyStoreState = {
	textInputRef: RefObject<TextInput> | null;
	currentFocusStatus: Patchwork.Status | null;
	actions: {
		setTextInputRef: (ref: React.RefObject<TextInput>) => void;
		changeCurrentStatus: (status: Patchwork.Status) => void;
		focusInput: () => void;
	};
};

export const useStatusReplyStore = create<StatusReplyStoreState>(
	(set, get) => ({
		textInputRef: null,
		currentFocusStatus: null,
		actions: {
			setTextInputRef: ref => set({ textInputRef: ref }),
			focusInput: () => {
				const ref = get().textInputRef;
				if (ref?.current) {
					ref.current.focus();
				}
			},
			changeCurrentStatus: status =>
				set(() => ({ currentFocusStatus: status })),
		},
	}),
);

export const useStatusReplyAction = () =>
	useStatusReplyStore(state => state.actions);
