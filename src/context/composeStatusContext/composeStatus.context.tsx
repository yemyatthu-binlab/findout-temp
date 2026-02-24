import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { composeReducer, initialState } from './composeStatus.reducer';
import {
	ComposeContextType,
	ComposeStateProviderProps,
} from './composeStatus.type';
import { useNavigation } from '@react-navigation/native';
import { useCTAactions } from '@/store/compose/callToAction/callToActionStore';
import { useManageAttachmentActions } from '@/store/compose/manageAttachments/manageAttachmentStore';

const ComposeContext = createContext<ComposeContextType | undefined>(undefined);

export const ComposeStatusProvider: React.FC<ComposeStateProviderProps> = ({
	children,
	type,
}) => {
	const [composeState, composeDispatch] = useReducer(
		composeReducer,
		initialState,
	);
	const navigation = useNavigation();
	const { onChangeCTAText } = useCTAactions();
	const { resetAttachmentStore } = useManageAttachmentActions();

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			if (type !== 'edit') {
				if (!['reply', 'schedule'].includes(type)) {
					composeDispatch({ type: 'clear' });
				}
				onChangeCTAText('');
				resetAttachmentStore();
			}
		});

		return () => unsubscribe();
	}, [navigation, type]);

	return (
		<ComposeContext.Provider value={{ composeState, composeDispatch }}>
			{children}
		</ComposeContext.Provider>
	);
};

export const useComposeStatus = () => {
	const context = useContext(ComposeContext);
	if (!context) {
		throw new Error('useComposeStatus must be used within a Compose Provider');
	}
	return context;
};

export const safeUseComposeStatus = () => {
	//only used for situation where this hook's component is sometimes used in pages that does not wrap with context provider
	try {
		return useComposeStatus();
	} catch {
		return null;
	}
};
