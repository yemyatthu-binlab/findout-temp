import { View, ViewProps } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';

type Props = {
	count: number;
} & ViewProps;

const ChannelRuleCircle = ({ count, ...props }: Props) => {
	return (
		<View
			className="rounded-full bg-red-600 w-[30] h-[30] items-center justify-center"
			{...props}
		>
			<ThemeText className="text-white">{count}</ThemeText>
		</View>
	);
};

export default ChannelRuleCircle;
