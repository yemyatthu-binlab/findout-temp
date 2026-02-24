import React from 'react';
import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Pressable, ScrollView, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { useActiveDomainAction } from '@/store/feed/activeDomain';
import { useNavigation } from '@react-navigation/native';
import Image from '@/components/atoms/common/Image/Image';
import { useAuthStore } from '@/store/auth/authStore';
import { useTranslation } from 'react-i18next';

type Props = {
	openThemeModal: boolean;
	onClose: () => void;
	data: Patchwork.Account[];
};

const ChatParticipants: React.FC<Props> = ({
	openThemeModal,
	onClose,
	data,
}) => {
	const { t } = useTranslation();
	const { setDomain } = useActiveDomainAction();
	const navigation = useNavigation();
	const { userOriginInstance } = useAuthStore();

	const onPressAvatar = (id: string) => {
		onClose();
		setDomain(userOriginInstance);
		navigation.navigate('ProfileOther', {
			id: id,
		});
	};
	return (
		<ThemeModal
			type="simple"
			visible={openThemeModal}
			onClose={onClose}
			title={t('conversation.chat_participants')}
			modalHeight={300}
			position="bottom"
		>
			<ScrollView showsVerticalScrollIndicator={false} className="p-3">
				{data?.length > 0 &&
					data.map(participant => (
						<Pressable
							key={participant.id}
							className="flex-row items-center py-3"
							onPress={() => onPressAvatar(participant.id)}
						>
							<Image
								uri={participant.avatar}
								className="w-14 h-14 rounded-full mr-3"
								resizeMode={FastImage.resizeMode.contain}
								iconSize={52}
							/>
							<View>
								<ThemeText emojis={participant.emojis}>
									{participant.display_name || participant.username}
								</ThemeText>
								<ThemeText>{participant.acct}</ThemeText>
							</View>
						</Pressable>
					))}
			</ScrollView>
		</ThemeModal>
	);
};

export default ChatParticipants;
