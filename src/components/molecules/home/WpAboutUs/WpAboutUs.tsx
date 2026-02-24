import { Button } from '@/components/atoms/common/Button/Button';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { HomeStackParamList } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import {
	StackNavigationProp,
	useGestureHandlerRef,
} from '@react-navigation/stack';
import { View, Text, Linking, Image } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { cn } from '@/util/helper/twutil';
import { isTablet } from '@/util/helper/isTablet';

const WpAboutUs = () => {
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

	const handlePress = async (url: string) => {
		if (!url) return;

		try {
			if (await InAppBrowser.isAvailable()) {
				await InAppBrowser.open(url, {
					dismissButtonStyle: 'close',
					readerMode: false,
					animated: true,
				});
			} else {
				Linking.openURL(url);
			}
		} catch (error) {
			console.error('Failed to open link:', error);
			Linking.openURL(url);
		}
	};

	return (
		<View className="my-5">
			<ThemeText
				className={cn(
					'font-NewsCycle_Bold',
					isTablet ? 'text-2xl mb-5' : 'text-lg mb-3',
				)}
			>
				About Us
			</ThemeText>
			<Image
				source={require('../../../../../assets/images/spotlight.jpg')}
				className={cn('w-full rounded-lg', isTablet ? 'h-[350]' : 'h-[200]')}
			/>
			<ThemeText
				className={cn(
					'font-NewsCycle_Bold',
					isTablet ? 'text-xl mt-5' : 'text-lg mt-3',
				)}
			>
				Independent Journalism Costs.
			</ThemeText>
			<ThemeText
				className={cn('font-NewsCycle_Bold', isTablet ? 'text-xl' : 'text-lg')}
			>
				Subservient Journalism Costs More.
			</ThemeText>
			<View className={cn('flex-row flex-1', isTablet ? 'my-6' : 'my-4')}>
				<Button
					className={cn(
						'bg-patchwork-secondary flex-1 mr-2',
						isTablet && 'h-[60] rounded-xl',
					)}
					onPress={() =>
						handlePress(
							'https://thebristolcable.org/join/?joinbutton=headerclick',
						)
					}
				>
					<ThemeText
						className={cn('text-white shadow-sm', isTablet && 'text-base')}
					>
						Support us
					</ThemeText>
				</Button>
				<Button
					variant="outline"
					className={cn('flex-1 ml-2', isTablet && 'h-[60] rounded-xl')}
					onPress={() => {
						handlePress('https://thebristolcable.org/newsletter/');
					}}
				>
					<ThemeText className={cn(isTablet && 'text-base')}>
						Subscribe
					</ThemeText>
				</Button>
			</View>
		</View>
	);
};

export default WpAboutUs;
