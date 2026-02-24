import {
	CheckMarkIcon,
	CloseIcon,
	SwitchOffIcon,
	SwitchOnIcon,
} from '@/util/svg/icon.common';
import { Platform, Pressable, View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { useChangeChannelContentType } from '@/hooks/mutations/channel.mutation';
import { updateChannelContentTypeCache } from '@/util/cache/channel/channelCache';
import Toast from 'react-native-toast-message';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

const AllContentSwitch = ({
	isSwitchOn,
	channelId,
}: {
	isSwitchOn: boolean;
	channelId: string;
}) => {
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();
	const { mutate } = useChangeChannelContentType({
		onMutate: ({ custom_condition }) => {
			updateChannelContentTypeCache(channelId, custom_condition);
		},
		onError: error => {
			Toast.show({
				type: 'errorToast',
				text1: error?.message || t('common.error'),
				position: 'top',
				topOffset: Platform.OS == 'android' ? 25 : 50,
			});
		},
	});

	return (
		<Pressable onPress={() => {}} className="flex-row items-center ">
			{isSwitchOn ? (
				<Pressable
					className="justify-center"
					onPress={() => {
						mutate({
							channel_type: 'custom_channel',
							custom_condition: 'and_condition',
							patchwork_community_id: channelId,
						});
					}}
				>
					<SwitchOnIcon width={42} className="mr-3" />
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
						mutate({
							channel_type: 'custom_channel',
							custom_condition: 'or_condition',
							patchwork_community_id: channelId,
						});
					}}
				>
					<SwitchOffIcon width={42} className="mr-3" />
					<CloseIcon
						className="absolute right-4"
						width={17}
						height={17}
						{...{ colorScheme }}
					/>
				</Pressable>
			)}
			<ThemeText>{t('open_to_anyone')}</ThemeText>
		</Pressable>
	);
};

export default AllContentSwitch;
