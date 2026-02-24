import { View, ViewProps } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import styles from './Header.style';
import Underline from '../Underline/Underline';
import { useAppearanceStore } from '@/store/feed/textAppearanceStore';

type Props = {
	title?: string;
	leftCustomComponent?: React.ReactElement;
	rightCustomComponent?: React.ReactElement;
	hideUnderline?: boolean;
	underlineClassName?: string;
} & ViewProps;
const Header = ({
	title,
	leftCustomComponent,
	rightCustomComponent,
	hideUnderline = false,
	underlineClassName,
	...props
}: Props) => {
	const fontScale = useAppearanceStore(state => state.fontScale);
	return (
		<>
			<View className={styles.headerContainer} {...props}>
				{leftCustomComponent && (
					<View className="absolute left-0 z-10">{leftCustomComponent}</View>
				)}
				<View className="flex-1 items-center justify-center">
					<ThemeText
						size={fontScale == 'small' ? 'fs_15' : 'md_16'}
						className="font-NewsCycle_Bold tracking-wide"
					>
						{title}
					</ThemeText>
				</View>
				{rightCustomComponent && (
					<View className="absolute right-0 z-10">{rightCustomComponent}</View>
				)}
				<View />
			</View>
			{/* {!hideUnderline && (
				<Underline className={`mb-3 ${underlineClassName || ''}`} />
			)} */}
		</>
	);
};

export default Header;
