import { View } from 'react-native';
import PollForm from '../PollForm/PollForm';
import ComposeTextInput from '@/components/atoms/compose/ComposeTextInput/ComposeTextInput';
import { LinkCard } from '@/components/atoms/compose/LinkCard/LinkCard';
import ImageCard from '@/components/atoms/compose/ImageCard/ImageCard';

const CreateComposeStatus = ({
	composeType,
}: {
	composeType: 'create' | 'schedule';
}) => {
	return (
		<View className="px-4">
			<ComposeTextInput accessibilityLabel="compose-text-input" />
			<PollForm composeType={composeType} />
			<LinkCard composeType={composeType} />
			<ImageCard composeType={composeType} />
		</View>
	);
};

export default CreateComposeStatus;
