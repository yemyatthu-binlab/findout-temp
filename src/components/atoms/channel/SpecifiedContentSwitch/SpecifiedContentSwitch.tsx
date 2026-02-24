import {
	CheckMarkIcon,
	CloseIcon,
	SwitchOffIcon,
	SwitchOnIcon,
} from '@/util/svg/icon.common';
import { Pressable } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { updateChannelContentTypeCache } from '@/util/cache/channel/channelCache';
import { useChangeChannelContentType } from '@/hooks/mutations/channel.mutation';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

export const SpecifiedContentSwitch = ({
	isSwitchOn,
	channelId,
}: {
	isSwitchOn: boolean;
	channelId: string;
}) => {
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();
	const { mutate, isPending } = useChangeChannelContentType({
		onMutate: ({ custom_condition }) => {
			updateChannelContentTypeCache(channelId, custom_condition);
		},
		onError: () => {},
	});
	return (
		<Pressable onPress={() => {}} className="flex-row items-center">
			{isSwitchOn ? (
				<Pressable
					className="justify-center"
					onPress={() => {
						if (isPending) return;
						mutate({
							channel_type: 'custom_channel',
							custom_condition: 'or_condition',
							patchwork_community_id: channelId,
						});
					}}
				>
					<SwitchOnIcon width={42} className="mr-3 relative" />
					<CheckMarkIcon
						stroke={'#fff'}
						className="absolute left-1"
						width={16}
						height={16}
					/>
				</Pressable>
			) : (
				<Pressable
					className="justify-center"
					onPress={() => {
						if (isPending) return;
						mutate({
							channel_type: 'custom_channel',
							custom_condition: 'and_condition',
							patchwork_community_id: channelId,
						});
					}}
				>
					<SwitchOffIcon
						width={42}
						className="mr-3"
						onPress={() => {
							if (isPending) return;
							mutate({
								channel_type: 'custom_channel',
								custom_condition: 'and_condition',
								patchwork_community_id: channelId,
							});
						}}
					/>
					<CloseIcon
						className="absolute right-4"
						width={17}
						height={17}
						{...{ colorScheme }}
					/>
				</Pressable>
			)}
			<ThemeText>{t('selcted_contributors_only')}</ThemeText>
		</Pressable>
	);
};

export default SpecifiedContentSwitch;
