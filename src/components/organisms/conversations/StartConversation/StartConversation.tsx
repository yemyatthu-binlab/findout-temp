import { Pressable, View } from 'react-native';
import React from 'react';
import { AtSignIcon } from '@/util/svg/icon.conversations';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

const StartConversation = ({ onPress }: { onPress: () => void }) => {
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();

	return (
		<View className="container mx-auto p-10 mt-20">
			<AtSignIcon className="self-center" colorScheme={colorScheme} />
			<ThemeText
				size={'lg_18'}
				className="font-NewsCycle_Bold text-center my-2"
			>
				{t('conversation.no_conversations')}
			</ThemeText>
			<ThemeText size={'sm_14'} className="tracking-wider text-center">
				{t('conversation.start_conversation_desc')}
			</ThemeText>
			<View className="mt-5 flex-row justify-center">
				<Pressable
					onPress={onPress}
					className="border border-patchwork-grey-100 py-1.5 px-4 rounded-full w-auto"
				>
					<ThemeText>{t('conversation.start_conversation')}</ThemeText>
				</Pressable>
			</View>
		</View>
	);
};

export default StartConversation;
