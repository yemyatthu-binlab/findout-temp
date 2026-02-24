import React from 'react';
import { ScrollView, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import ComposeTextInput from '@/components/atoms/compose/ComposeTextInput/ComposeTextInput';
import { LinkCard } from '@/components/atoms/compose/LinkCard/LinkCard';
import ImageCard from '@/components/atoms/compose/ImageCard/ImageCard';
import StatusWrapper from '../../feed/StatusWrapper/StatusWrapper';

const RepostStatus = ({ status }: { status: Patchwork.Status }) => {
	const { colorScheme } = useColorScheme();
	return (
		<ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
			<View className="flex-row justify-between">
				<ThemeText size={'xs_12'} className="opacity-80">
					Re-posting <ThemeText>▸</ThemeText>{' '}
					<ThemeText
						emojis={status.account.emojis}
						size={'xs_12'}
						variant={'textPrimary'}
					>
						@{status.account.display_name || status.account.username}
					</ThemeText>
				</ThemeText>
			</View>
			<ComposeTextInput />
			<LinkCard composeType="repost" />
			<ImageCard composeType="repost" />

			<StatusWrapper
				status={status}
				currentPage="Compose"
				statusType="reposting"
			/>
		</ScrollView>
	);
};

export default RepostStatus;
