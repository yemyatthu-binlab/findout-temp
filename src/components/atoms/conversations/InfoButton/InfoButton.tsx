import { InfoIcon } from '@/util/svg/icon.conversations';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
	onPress?: () => void;
	extraClass?: string;
};
const InfoButton = ({ onPress, extraClass }: Props) => {
	const { colorScheme } = useColorScheme();

	return (
		<TouchableOpacity onPress={onPress}>
			<InfoIcon colorScheme={colorScheme} />
		</TouchableOpacity>
	);
};

export default InfoButton;
