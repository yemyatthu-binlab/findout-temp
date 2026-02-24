import { useCallback } from 'react';
import { Platform } from 'react-native';
import Share from 'react-native-share';

export const useSharePost = () => {
	const handleSharePress = useCallback(
		async (link: string, title: string = 'Find Out') => {
			const options: any = Platform.select({
				ios: {
					activityItemSources: [
						{
							placeholderItem: {
								type: 'url',
								content: link,
							},
							item: {
								default: {
									type: 'url',
									content: link,
								},
							},
							linkMetadata: {
								title,
								icon: 'https://cdn.iconscout.com/icon/free/png-256/free-share-referral-networking-media-social-connection-3-22802.png',
							},
						},
					],
				},
				default: {
					title,
					subject: title,
					message: link,
				},
			});

			try {
				await Share.open(options);
			} catch (error) {
				console.log('Share cancelled or failed:', error);
			}
		},
		[],
	);

	return { handleSharePress };
};
