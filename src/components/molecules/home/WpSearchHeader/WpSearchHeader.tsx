import TextInput from '@/components/atoms/common/TextInput/TextInput';
import {
	CrossMarkIcon,
	SearchIcon,
	SwipeToLeftIcon,
} from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';
import { View, Text, Pressable } from 'react-native';
import { WpCategorySection } from '../WpCategorySection/WpCategorySection';
import { memo } from 'react';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Underline from '@/components/atoms/common/Underline/Underline';
import WpMoreToExplore from '../WpMoreToExplore/WpMoreToExplore';
import WpAboutUs from '../WpAboutUs/WpAboutUs';
import { useShowMastodonInstance } from '@/hooks/queries/auth.queries';

const WpSearchHeader = ({
	searchQuery,
	setSearchQuery,
	setDebouncedSearchQuery,
	totalResults,
}: {
	searchQuery: string;
	setSearchQuery: (str: string) => void;
	setDebouncedSearchQuery: (str: string) => void;
	totalResults: number;
}) => {
	const { colorScheme } = useColorScheme();
	const { data: showSupoprtUsSection } = useShowMastodonInstance();

	return (
		<View className="my-4 mx-4">
			<TextInput
				placeholder="Search for a story..."
				value={searchQuery}
				onChangeText={setSearchQuery}
				startIcon={<SearchIcon className="mt-[2]" />}
				endIcon={
					searchQuery.length > 0 ? (
						<Pressable
							className="py-2 -mt-[10] active:opacity-80"
							onPress={() => {
								setSearchQuery('');
								setDebouncedSearchQuery('');
							}}
						>
							<CrossMarkIcon
								stroke={colorScheme === 'dark' ? 'white' : 'gray'}
								width={18}
								height={18}
							/>
						</Pressable>
					) : undefined
				}
			/>
			{totalResults > 0 && (
				<ThemeText className="mt-4">Total results: {totalResults}</ThemeText>
			)}

			{searchQuery.length === 0 && (
				<>
					<WpCategorySection
						title="Latest Stories"
						layout="horizontal"
						limit={5}
					/>
					<WpCategorySection
						title="Investigations"
						categoryId={36}
						layout="horizontal"
						limit={5}
					/>
					<View className="mt-5 ">
						<Underline />
						<View className="py-5 flex-row items-center justify-between">
							<ThemeText className="text-lg w-[270] font-NewsCycle_Bold">
								Swipe to engage with supporters of independent journalism
							</ThemeText>
							<SwipeToLeftIcon colorScheme={colorScheme} />
						</View>
						<Underline />
					</View>
					<WpMoreToExplore />
					{showSupoprtUsSection?.data?.display && <WpAboutUs />}
					<WpCategorySection
						title="Area In Focus"
						categoryId={4359}
						layout="vertical"
						limit={3}
					/>
					<WpCategorySection
						title="Podcast Episodes"
						categoryId={3821}
						layout="vertical"
						limit={3}
					/>
				</>
			)}
		</View>
	);
};

export default memo(WpSearchHeader);
