import Image from '@/components/atoms/common/Image/Image';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { RootStackParamList } from '@/types/navigation';
import { cn } from '@/util/helper/twutil';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pressable, View, ViewProps } from 'react-native';

type Props = {
	account: Patchwork.Account; // Temporarily add 'any' type here //
	size?: 'sm' | 'md' | 'lg';
	dotAlert?: boolean;
	onPress?: () => void;
} & ViewProps;

const sizeMapping = {
	sm: 'w-[80] h-[80]',
	md: 'w-[100] h-[100]',
	lg: 'w-[149] h-[149]',
};

const AccountAvatar = ({
	account,
	size = 'md',
	dotAlert = false,
	onPress,
	...props
}: Props) => {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	return (
		<Pressable {...props} onPress={onPress}>
			<View className="items-center ">
				<Image
					uri={account.avatar}
					className={cn(
						'rounded-full bg-patchwork-dark-50 border border-slate-100 dark:border-none',
						sizeMapping[size],
					)}
				/>
				<ThemeText
					ellipsizeMode="tail"
					numberOfLines={1}
					size={'sm_14'}
					className="mt-2 text-center"
					emojis={account.emojis}
				>
					{account.display_name || account.username}
				</ThemeText>
				{dotAlert && (
					<View
						className={cn(
							'absolute border-2 border-white dark:border-patchwork-dark-100 bg-patchwork-primary dark:bg-patchwork-primary-dark w-[13] h-[13] rounded-full',
							size == 'md' ? 'top-[4] right-[12]' : 'top-[8] right-[25]',
						)}
					/>
				)}
			</View>
		</Pressable>
	);
};

export default AccountAvatar;
