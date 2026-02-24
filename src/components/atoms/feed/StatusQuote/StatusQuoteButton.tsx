import {
	TouchableOpacityProps,
	TouchableOpacity,
	Pressable,
	View,
} from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { DoubleQouteRightIcon } from '@/util/svg/icon.compose';
import { useNavigation } from '@react-navigation/native';
import customColor from '@/util/constant/color';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '@/types/navigation';
import { useQuoteStore } from '@/store/feed/quoteStore';
import { useColorScheme } from 'nativewind';
import { cn } from '@/util/helper/twutil';
import {
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger,
} from 'react-native-popup-menu';
import { useState } from 'react';
import { formatFollowersCount } from '@/util/helper/helper';

type Props = {
	count: number;
	status: Patchwork.Status;
} & TouchableOpacityProps;

const StatusQuoteButton = ({ count, status, ...props }: Props) => {
	const { colorScheme } = useColorScheme();
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { setQuotedStatus } = useQuoteStore();

	const [isMenuVisible, setMenuVisible] = useState(false);

	const toggleMenu = () => {
		setMenuVisible(p => !p);
	};

	const handlePress = () => {
		setQuotedStatus(status);
		navigation.navigate('QuotePost', {
			statusId: status.id,
		});
	};

	if (status.quote_approval?.current_user !== 'automatic') {
		return (
			<Menu
				opened={isMenuVisible}
				onBackdropPress={toggleMenu}
				style={{ marginTop: 6 }}
			>
				<MenuTrigger>
					<Pressable
						onPress={toggleMenu}
						className="flex-row items-center gap-1 opacity-60"
						{...props}
					>
						<DoubleQouteRightIcon
							width="20"
							height="20"
							stroke={colorScheme === 'dark' ? '#5A5A5A' : '#BDBDBD'}
							strokeWidth={0.3}
							colorScheme={colorScheme}
						/>
						<ThemeText variant="textGrey">
							{formatFollowersCount(count)}
						</ThemeText>
					</Pressable>
				</MenuTrigger>

				<MenuOptions
					customStyles={{
						optionsContainer: {
							backgroundColor:
								colorScheme === 'dark'
									? customColor['patchwork-dark-400']
									: '#fff',
							borderRadius: 10,
							shadowOpacity: 0.1,
							elevation: 2,
							width: 'auto',
						},
					}}
				>
					<>
						<MenuOption
							onSelect={() => {}}
							disabled={true}
							style={{ paddingRight: 15 }}
						>
							<View className={cn('flex-row items-center gap-1 px-1 py-1')}>
								<DoubleQouteRightIcon
									width="20"
									height="20"
									stroke={'#828689'}
									colorScheme={colorScheme}
									strokeWidth={0.3}
								/>
								<ThemeText variant={'textGrey'} className="text-xs ml-12">
									{status?.quote_approval?.automatic?.includes('followers')
										? 'Allowed followers only'
										: 'Not enabled'}
								</ThemeText>
							</View>
						</MenuOption>
					</>
				</MenuOptions>
			</Menu>
		);
	}

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			className={cn(
				'flex-row items-center gap-1 px-1',
				status?.quote_approval?.current_user !== 'automatic' && 'opacity-50',
			)}
			onPress={handlePress}
			disabled={status?.quote_approval?.current_user !== 'automatic'}
			{...props}
		>
			<DoubleQouteRightIcon
				width="20"
				height="20"
				stroke={'#828689'}
				strokeWidth={0.3}
				colorScheme={colorScheme}
			/>
			<ThemeText variant="textGrey">{count}</ThemeText>
		</TouchableOpacity>
	);
};

export default StatusQuoteButton;
