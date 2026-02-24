import { Pressable, View } from 'react-native';
import React from 'react';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { VerifyIcon } from '@/util/svg/icon.conversations';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { useActiveDomainAction } from '@/store/feed/activeDomain';
import { useAuthStore } from '@/store/auth/authStore';
import Image from '@/components/atoms/common/Image/Image';

type Props = {
	onPressBackButton: () => void;
	chatParticipant: Patchwork.Account | undefined;
	isAccountVerified?: boolean;
};

const ConversationsHeader = ({
	onPressBackButton,
	chatParticipant,
	isAccountVerified,
}: Props) => {
	const { colorScheme } = useColorScheme();
	const navigation = useNavigation();
	const { setDomain } = useActiveDomainAction();
	const { userOriginInstance } = useAuthStore();

	const handleAvatarPress = () => {
		setDomain(userOriginInstance);
		navigation.navigate('ProfileOther', {
			id: chatParticipant?.id!,
		});
	};

	return (
		<View className="flex-row justify-center items-center mx-4 mt-4 mb-5">
			<View className="absolute left-0 z-10">
				<BackButton customOnPress={onPressBackButton} />
			</View>
			<Pressable
				onPress={handleAvatarPress}
				className="flex-1 flex-row ml-14 items-center"
			>
				<Image
					className="w-10 h-10 rounded-full bg-patchwork-dark-50 border-patchwork-grey-50 border"
					uri={chatParticipant?.avatar}
				/>
				<View className="flex-row items-center flex-shrink ml-3">
					<ThemeText
						emojis={chatParticipant?.emojis}
						numberOfLines={1}
						ellipsizeMode="tail"
						className="font-NewsCycle_Bold mr-2"
					>
						{chatParticipant?.display_name || chatParticipant?.username}
					</ThemeText>
					{isAccountVerified && <VerifyIcon colorScheme={colorScheme} />}
				</View>
			</Pressable>
			<View />
		</View>
	);
};

export default ConversationsHeader;
