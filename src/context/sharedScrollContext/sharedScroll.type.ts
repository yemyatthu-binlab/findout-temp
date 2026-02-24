import { ReactNode } from 'react';
import { SharedValue } from 'react-native-reanimated';

export type ScrollContextType = {
	channelScrollYOffset: SharedValue<number>;
	profileScrollYOffest: SharedValue<number>;
};

export type ScrollProviderProps = {
	children: ReactNode;
};
