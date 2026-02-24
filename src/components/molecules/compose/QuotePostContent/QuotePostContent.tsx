import { ScrollView, View } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import ComposeTextInput from '@/components/atoms/compose/ComposeTextInput/ComposeTextInput';
import StatusWrapper from '@/components/organisms/feed/StatusWrapper/StatusWrapper';
import { useQuoteStore } from '@/store/feed/quoteStore';

const QuotePostContent = ({ statusId }: { statusId: string }) => {
	const { quotedStatus } = useQuoteStore();

	if (!quotedStatus) {
		return <View />;
	}

	return (
		<ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
			<ComposeTextInput />

			<View className="mt-4 mb-10">
				<ThemeText size="xs_12" className="mb-2 opacity-70">
					Quoting @{quotedStatus.account.username}
				</ThemeText>
				<StatusWrapper
					status={quotedStatus}
					currentPage="Compose"
					statusType="quoting"
				/>
			</View>
		</ScrollView>
	);
};

export default QuotePostContent;
