import { Pressable, View } from 'react-native';
import React from 'react';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { useActiveDomainAction } from '@/store/feed/activeDomain';
import ConversationImage from '@/components/atoms/conversations/ConversationImage/ConversationImage';
import { useAuthStore } from '@/store/auth/authStore';

type Props = {
	onPressBackButton: () => void;
	chatParticipants: Patchwork.Account[] | undefined;
	onPress: () => void;
};

const GroupConversationsHeader = ({
	onPressBackButton,
	chatParticipants,
	onPress,
}: Props) => {
	const { colorScheme } = useColorScheme();
	const navigation = useNavigation();
	const { setDomain } = useActiveDomainAction();
	const { userOriginInstance } = useAuthStore();

	const handleAvatarPress = () => {
		setDomain(userOriginInstance);
		onPress();
	};

	return (
		<View className="flex-row justify-center items-center mx-4 mt-4 mb-5">
			<View className="flex:1 absolute left-0 z-10">
				<BackButton customOnPress={onPressBackButton} />
			</View>
			<Pressable
				onPress={handleAvatarPress}
				className="flex-1 flex-row ml-14 items-center"
			>
				{chatParticipants && (
					<ConversationImage
						accounts={chatParticipants}
						firstImageExtraStyle="w-9 h-9"
						secImageExtraStyle="w-7 h-7"
						secImageWrapperExtraStyle="bottom-4 left-4"
						additionalUserCountExtraStyle="w-8 h-8 bottom-4 left-4"
					/>
				)}
				<View className="flex-row items-center flex-shrink ml-3">
					<View className="flex-row items-center flex-wrap -ml-5">
						{chatParticipants &&
							chatParticipants.map((acc, idx) => {
								if (idx == 2) {
									return (
										<ThemeText key={idx} className="font-NewsCycle_Bold">
											{' '}
											+ {chatParticipants.length - 2}
										</ThemeText>
									);
								}
								if (idx > 2) return <View key={idx}></View>;
								return (
									<ThemeText
										emojis={acc.emojis}
										key={idx}
										className="font-NewsCycle_Bold"
									>
										{acc.display_name || acc.username}
										{idx !== chatParticipants.length - 1 ? ', ' : ''}
									</ThemeText>
								);
							})}
					</View>
				</View>
			</Pressable>
			<View />
		</View>
	);
};

export default GroupConversationsHeader;
