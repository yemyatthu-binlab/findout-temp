import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { View, ViewProps, TextProps } from 'react-native';
import styles from './QuickVerticalInfo.style';
import Image from '@/components/atoms/common/Image/Image';

interface QuickVerticalInfoProps {
	name: string;
	count: number;
	image: any;
	countColor?: any;
}

const QuickVerticalInfo = ({
	name,
	count,
	countColor,
	image,
	...props
}: QuickVerticalInfoProps & ViewProps & TextProps) => {
	return (
		<View className="items-center mr-3  pt-[6px]">
			<Image uri={image} className="w-[50] h-[50]" />
			<View className={styles.countContainer} {...props}>
				<ThemeText size={'xs_12'} className={`${countColor}`}>
					{count}
				</ThemeText>
			</View>
			<ThemeText size={'xs_12'} className="mt-1 font-NewsCycle_Bold">
				{name}
			</ThemeText>
		</View>
	);
};

export default QuickVerticalInfo;
