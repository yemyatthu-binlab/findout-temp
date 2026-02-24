import { TextProps, View, ViewProps } from 'react-native';
import { ThemeText } from '../ThemeText/ThemeText';

type Props = {
	isRequired?: boolean;
	title: string;
} & ViewProps;

const InputFieldName = ({ isRequired, title, ...props }: Props) => {
	return (
		<View className="flex-row" {...props}>
			<ThemeText className="font-NewsCycle_Bold mb-3" size="md_16">
				{title}
			</ThemeText>
			{isRequired && (
				<View>
					<ThemeText className="text-red-600 ml-1">*</ThemeText>
				</View>
			)}
		</View>
	);
};

export default InputFieldName;
