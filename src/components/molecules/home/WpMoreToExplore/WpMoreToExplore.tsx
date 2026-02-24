import { View, Text, Pressable, Linking, Image } from 'react-native';
import React from 'react';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { ChevronRightIcon } from '@/util/svg/icon.common';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '@/types/navigation';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import FastImage from '@d11/react-native-fast-image';
import { cn } from '@/util/helper/twutil';
import { isTablet } from '@/util/helper/isTablet';
import { useGetLatestPrintEdition } from '@/hooks/queries/wpFeed.queries';

const EDITION_FOURTYONE_CATEGORYID = '4468';
const WpMoreToExplore = () => {
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

	const { data: latestPrintEdition } = useGetLatestPrintEdition();

	const handlePress = async (url: string) => {
		try {
			if (await InAppBrowser.isAvailable()) {
				await InAppBrowser.open(url, {
					dismissButtonStyle: 'cancel',
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
				More to explore
			</ThemeText>

			<View
				className={cn(
					'flex-row flex-wrap justify-between flex-1',
					isTablet ? 'gap-4' : 'gap-2',
				)}
			>
				<Pressable
					className={cn(
						'flex-1 relative rounded-lg overflow-hidden active:opacity-90',
						isTablet ? 'h-64' : 'h-40',
					)}
					onPress={() => {
						navigation.navigate('WpCategoryViewAll', {
							categoryId: parseInt(
								latestPrintEdition?.categoryId || EDITION_FOURTYONE_CATEGORYID,
							),
							title: 'Latest Print Edition',
							categoryType: 'list',
						});
					}}
				>
					<Image
						source={require('../../../../../assets/images/spotlight.jpg')}
						className="w-full h-full"
					/>
					<View className="absolute w-full h-full inset-0 bg-black/20" />
					<View
						className={cn(
							'absolute flex-row items-center',
							isTablet ? 'bottom-4 left-4' : 'bottom-2 left-2',
						)}
					>
						<ThemeText
							className={cn(
								'text-white font-NewsCycle_Bold flex-1',
								isTablet ? 'text-base' : 'text-xs',
							)}
						>
							Latest Print Edition
						</ThemeText>
						<ChevronRightIcon
							className={cn('mr-4', isTablet ? 'mt-1.5' : 'mt-1')}
							fill={'#fff'}
						/>
					</View>
				</Pressable>
				<Pressable
					className={cn(
						'flex-1 relative rounded-lg overflow-hidden active:opacity-90',
						isTablet ? 'h-64' : 'h-40',
					)}
					onPress={() => {
						navigation.navigate('WpCategoryViewAll', {
							categoryId: 4464,
							title: 'Nikesh Shukla’s Column',
							categoryType: 'list',
						});
					}}
				>
					<FastImage
						source={{
							uri: 'https://static.thebristolcable.org/uploads/2025/06/000066760008_d2-1.jpg',
						}}
						className="w-full h-full"
					/>
					<View className="absolute w-full h-full inset-0 bg-black/20" />
					<View
						className={cn(
							'absolute flex-row items-center',
							isTablet ? 'bottom-4 left-4' : 'bottom-2 left-2',
						)}
					>
						<ThemeText
							className={cn(
								'text-white font-NewsCycle_Bold flex-1',
								isTablet ? 'text-base' : 'text-xs',
							)}
						>
							Nikesh Shukla’s Column
						</ThemeText>
						<ChevronRightIcon
							className={cn('mr-4', isTablet ? 'mt-1.5' : 'mt-1')}
							fill={'#fff'}
						/>
					</View>
				</Pressable>
			</View>

			<View
				className={cn(
					'flex-row flex-wrap justify-between flex-1',
					isTablet ? 'gap-4 mt-4' : 'gap-1 mt-1',
				)}
			>
				<Pressable
					className={cn(
						'flex-1 relative rounded-lg overflow-hidden active:opacity-90',
						isTablet ? 'h-64' : 'h-40',
					)}
					onPress={() =>
						handlePress('https://thebristolcable.org/bristol-cable-events')
					}
				>
					<Image
						source={require('../../../../../assets/images/bristolEvent.png')}
						className="w-full h-full"
					/>
					<View className="absolute w-full h-full inset-0 bg-black/20" />
					<View
						className={cn(
							'absolute flex-row items-center',
							isTablet ? 'bottom-4 left-4' : 'bottom-2 left-2',
						)}
					>
						<ThemeText
							className={cn(
								'text-white font-NewsCycle_Bold flex-1',
								isTablet ? 'text-base' : 'text-xs',
							)}
						>
							Bristol Cable Events
						</ThemeText>
						<ChevronRightIcon
							className={cn('mr-4', isTablet ? 'mt-1.5' : 'mt-1')}
							fill={'#fff'}
						/>
					</View>
				</Pressable>

				<Pressable
					className={cn(
						'flex-1 relative rounded-lg overflow-hidden active:opacity-90',
						isTablet ? 'h-64' : 'h-40',
					)}
					onPress={() => {
						handlePress('https://thebristolcable.org/newsletter/');
					}}
				>
					<Image
						source={require('../../../../../assets/images/letter.png')}
						className="w-full h-full"
					/>
					<View className="absolute w-full h-full inset-0 bg-black/20" />
					<View
						className={cn(
							'absolute flex-row items-center',
							isTablet ? 'bottom-4 left-4' : 'bottom-2 left-2',
						)}
					>
						<ThemeText
							className={cn(
								'text-white font-NewsCycle_Bold flex-1',
								isTablet ? 'text-base' : 'text-xs',
							)}
						>
							Letters
						</ThemeText>
						<ChevronRightIcon
							className={cn('mr-4', isTablet ? 'mt-1.5' : 'mt-1')}
							fill={'#fff'}
						/>
					</View>
				</Pressable>
			</View>
		</View>
	);
};

export default WpMoreToExplore;
