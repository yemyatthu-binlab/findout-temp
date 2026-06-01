import { useMMKVString } from 'react-native-mmkv';
import { storage } from '@/App';

export const useWhiteLabelImages = () => {
	const [appIcon] = useMMKVString('whiteLabelAppIcon', storage);
	const [splashIcon] = useMMKVString('whiteLabelSplashIcon', storage);

	return { appIcon, splashIcon };
};
