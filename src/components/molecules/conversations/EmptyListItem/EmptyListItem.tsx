import ConversationsListLoading from '@/components/atoms/loading/ConversationsListLoading';
import StartConversation from '@/components/organisms/conversations/StartConversation/StartConversation';
import { isTablet } from '@/util/helper/isTablet';

export const EmptyListComponent = ({
	isLoading,
	onPress,
}: {
	isLoading: boolean;
	onPress: () => void;
}) => {
	if (isLoading) {
		return Array(isTablet ? 13 : 7)
			.fill(null)
			.map((_, index) => <ConversationsListLoading key={index} />);
	}
	return <StartConversation onPress={onPress} />;
};
