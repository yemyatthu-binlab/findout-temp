import { ScrollView } from 'react-native';
import PollForm from '../PollForm/PollForm';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { cn } from '@/util/helper/twutil';

const ReplyPollForm = () => {
	const { composeState } = useComposeStatus();

	return (
		<ScrollView
			className={cn('max-h-[200] mb-4 rounded-lg', composeState.poll && '')}
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps="always"
		>
			<PollForm composeType="reply" />
		</ScrollView>
	);
};
export default ReplyPollForm;
