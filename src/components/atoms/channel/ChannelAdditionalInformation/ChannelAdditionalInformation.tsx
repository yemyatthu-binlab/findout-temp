import { View } from 'react-native';
import { DeleteIcon } from '@/util/svg/icon.common';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TextInput from '../../common/TextInput/TextInput';

const ChannelAdditionalInformation = () => {
	return (
		<View className="flex-row items-center">
			<View className="flex-1">
				<TextInput placeholder="Enter a heading" />
				<View className="mt-4" />
				<TextInput placeholder="Enter additional information text" />
			</View>
			<TouchableOpacity activeOpacity={0.8}>
				<DeleteIcon className="ml-3" />
			</TouchableOpacity>
		</View>
	);
};

export default ChannelAdditionalInformation;
