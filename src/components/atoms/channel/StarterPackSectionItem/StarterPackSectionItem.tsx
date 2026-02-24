import { Pressable, View, ViewProps } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { ChevronRightIcon, UserAccountIcon } from '@/util/svg/icon.common';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList, SearchStackParamList } from '@/types/navigation';
import { useColorScheme } from 'nativewind';
import LinearGradient from 'react-native-linear-gradient';
import { gradientColorSchemes } from '@/util/constant/starterPackColorList';

type Props = {
	item: Patchwork.StarterPack;
	index: number;
} & ViewProps;

const StarterPackSectionItem = ({ item, index, ...props }: Props) => {
	const { colorScheme } = useColorScheme();
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const colorIndex = index % gradientColorSchemes.length;
	const currentGradient = gradientColorSchemes[colorIndex];

	return (
		<Pressable
			className="mb-4 w-[300] mx-3 active:opacity-90"
			onPress={() => {
				navigation.navigate('StarterPackDetail', {
					slug: item?.id,
					title: item?.title,
					description: item.description,
					collected_by:
						item.collected_by.display_name + ' ' + item.collected_by?.acct,
					gradientColors: currentGradient,
				});
			}}
			{...props}
		>
			<View className="rounded-lg h-[160] bg-patchwork-light-100 dark:bg-patchwork-dark-900 shadow-md overflow-hidden">
				<LinearGradient
					colors={currentGradient}
					className="w-full h-full absolute top-0 right-0 bottom-0 left-0"
					angle={360}
				/>
				{/* <LinearGradient
					colors={['transparent', '#fff5']}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					className="absolute top-0 left-0 right-0 bottom-0"
				/> */}
				<View className="w-[250] h-[250] bg-white/10 absolute -top-20 -right-14 rounded-full" />
				<View className="w-[200] h-[200] bg-white/10 absolute -bottom-24 right-16 rounded-full" />
				<View className="justify-center px-2 pt-3 pb-3">
					<View className="flex-row items-center">
						<ThemeText className="font-NewsCycle_Bold text-white ml-2">
							{item.title}
						</ThemeText>
					</View>
					<ThemeText
						className="text-patchwork-grey-700 dark:text-patchwork-grey-300 ml-2 mt-1 text-white"
						size={'fs_13'}
					>
						By {item.collected_by.display_name}
					</ThemeText>
				</View>

				<View className="px-4 pb-3 pt-1 flex-1">
					<ThemeText
						size={'fs_13'}
						numberOfLines={2}
						className="mb-3 text-white"
					>
						{item.description}
					</ThemeText>
					<View className="flex-1" />
					<View className="flex-row justify-between items-center mt-2">
						<View className="flex-row items-center">
							<UserAccountIcon
								colorScheme="dark"
								fill={'#fff'}
								width={16}
								height={16}
								className="mr-2"
							/>
							<ThemeText size={'fs_13'} className="text-white">
								{item.total_accounts}
							</ThemeText>
						</View>

						<ChevronRightIcon className="ml-1" colorScheme={'dark'} />
					</View>
				</View>
			</View>
		</Pressable>
	);
};

export default StarterPackSectionItem;
