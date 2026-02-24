// import 'whatwg-fetch';
import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-reanimated', () =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	require('react-native-reanimated/mock'),
);

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('react-native-encrypted-storage', () => ({
	getItem: jest.fn(() => Promise.resolve('mocked-auth-token')),
	setItem: jest.fn(() => Promise.resolve()),
	removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-keyboard-aware-scroll-view', () => {
	const KeyboardAwareScrollView = ({ children }) => children;
	return { KeyboardAwareScrollView };
});
jest.mock('@d11/react-native-fast-image', () => {
	const { View } = require('react-native');

	const FastImage = props => {
		return <View {...props} />;
	};

	FastImage.resizeMode = {
		contain: 'contain',
		cover: 'cover',
		stretch: 'stretch',
		center: 'center',
	};

	FastImage.priority = { high: 'high' };
	FastImage.cacheControl = { immutable: 'immutable' };

	return FastImage;
});

jest.mock('@react-navigation/native', () => {
	return {
		...jest.requireActual('@react-navigation/native'),
		useNavigation: jest.fn(),
		useRoute: jest.fn(),
		useFocusEffect: jest.fn(callback => callback()),
	};
});

jest.mock('react-native-mmkv', () => {
	const storage = new Map();

	return {
		MMKV: jest.fn().mockImplementation(() => ({
			set: jest.fn((key, value) => {
				storage.set(key, value);
			}),
			getString: jest.fn(key => {
				return storage.get(key);
			}),
			getNumber: jest.fn(key => {
				return storage.get(key);
			}),
			getBoolean: jest.fn(key => {
				return storage.get(key);
			}),
			delete: jest.fn(key => {
				storage.delete(key);
			}),
			contains: jest.fn(key => {
				return storage.has(key);
			}),
			getAllKeys: jest.fn(() => {
				return Array.from(storage.keys());
			}),
			clearAll: jest.fn(() => {
				storage.clear();
			}),
			recache: jest.fn(),
		})),
	};
});

jest.mock('@shopify/flash-list', () => {
	const { View } = require('react-native');
	return {
		FlashList: View,
	};
});

jest.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: key => key,
		i18n: {
			language: 'en',
		},
	}),
}));
