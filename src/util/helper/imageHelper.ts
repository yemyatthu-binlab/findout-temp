import { storage } from '@/App';

export const downloadAndSaveWhiteLabelImages = async (branding: any[]) => {
	if (!branding || branding.length === 0) return;
	const appIconUrl = branding[0].appIcon;
	const splashIconUrl = branding[0].splashIcon;

	const processImage = async (url: string, key: string) => {
		if (!url) return;
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const base64Data: string = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(blob);
			});
			console.log('base64Database64Data::', base64Data);

			storage.set(key, base64Data);
			console.log(`White-label image (${key}) successfully saved to MMKV!`);
		} catch (error) {
			console.error(`Failed to save white-label image (${key}):`, error);
		}
	};

	await Promise.all([
		processImage(appIconUrl, 'whiteLabelAppIcon'),
		processImage(splashIconUrl, 'whiteLabelSplashIcon'),
	]);
};
