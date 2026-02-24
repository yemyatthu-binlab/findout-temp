import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { EyeSlashIcon } from '@/util/svg/icon.compose';

type Props = {
	mediaType: 'photo' | 'video';
	onViewSensitiveContent: () => void;
	onViewMastodonSensitiveContent?: () => void;
	sensitiveFromMastodon?: boolean;
};

const SensitiveMedia: React.FC<Props> = ({
	mediaType = 'photo',
	onViewSensitiveContent,
	onViewMastodonSensitiveContent,
	sensitiveFromMastodon,
}) => {
	return (
		<View style={styles.sensitiveContainer}>
			<EyeSlashIcon />
			<ThemeText
				size={'xs_12'}
				className="font-NewsCycle_Bold text-white text-center my-1"
			>
				This {mediaType === 'photo' ? 'photo' : 'video'} may include sensitive
				content for some groups of people.
			</ThemeText>
			<Pressable
				onPress={
					sensitiveFromMastodon
						? onViewMastodonSensitiveContent
						: onViewSensitiveContent
				}
				className="bg-slate-200 dark:bg-[#36466366] border border-patchwork-grey-50 px-2 py-1 flex-row items-center rounded-3xl justify-center active:opacity-40"
			>
				<ThemeText size={'xs_12'} className="font-Inter_Regular">
					View anyway
				</ThemeText>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	sensitiveContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 5,
	},
});

export default SensitiveMedia;
