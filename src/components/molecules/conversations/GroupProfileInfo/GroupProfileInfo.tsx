import { Pressable, View } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useColorScheme } from 'nativewind';
import { useAuthStore } from '@/store/auth/authStore';
import { getInstanceName } from '@/util/helper/getInstanceName';
import ConversationImage from '@/components/atoms/conversations/ConversationImage/ConversationImage';
import { useTranslation } from 'react-i18next';

type Props = {
	userInfo: Patchwork.Account[];
	onPress: () => void;
};

const GroupProfileInfo = ({ userInfo, onPress }: Props) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const { userOriginInstance } = useAuthStore();
	const defaultInstance = getInstanceName(userOriginInstance);

	return (
		<View className="mt-10">
			{/* <FastImage
				className="w-full h-28 rounded-b-md"
				source={{ uri: userInfo?.header_static }}
				resizeMode={FastImage.resizeMode.cover}
			/> */}
			<Pressable className="mx-auto" onPress={onPress}>
				<ConversationImage
					accounts={userInfo}
					firstImageExtraStyle="w-16 h-16"
					secImageExtraStyle="w-12 h-12"
					secImageWrapperExtraStyle="bottom-9 left-9"
					additionalUserCountExtraStyle="w-[52] h-[52] bottom-9 left-9"
				/>
			</Pressable>
			<View className="mx-auto items-center px-5">
				<View className="flex-row my-3 items-center mb-0">
					<View className="flex-row items-center flex-wrap -ml-5">
						{userInfo &&
							userInfo.map((acc, idx) => {
								if (idx == 2) {
									return (
										<ThemeText key={idx}> + {userInfo.length - 2}</ThemeText>
									);
								}
								if (idx > 2) return <View key={idx}></View>;
								return (
									<ThemeText emojis={acc.emojis} key={idx}>
										{acc.display_name || acc.username}
										{idx !== userInfo.length - 1 ? ', ' : ''}
									</ThemeText>
								);
							})}
					</View>
				</View>
				<View className="flex-row items-center mb-3 flex-wrap justify-center"></View>
			</View>
			<View className="bg-patchwork-light-100 dark:bg-patchwork-dark-400 rounded-xl mr-4 items-center px-4 py-4 ml-4 mt-2 mb-10">
				<ThemeText className="mb-1 font-NewsCycle_Bold">
					{t('conversation.not_end_to_end_encrypted')}
				</ThemeText>
				<ThemeText className="text-center">
					{t('conversation.unencrypted_detail')}
				</ThemeText>
			</View>
		</View>
	);
};

export default GroupProfileInfo;
