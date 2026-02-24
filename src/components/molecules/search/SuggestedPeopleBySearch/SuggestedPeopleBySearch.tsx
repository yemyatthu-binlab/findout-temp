import customColor from '@/util/constant/color';
import { useCallback, useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { useNavigation } from '@react-navigation/native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import SuggestedPeopleBySearchItem from '@/components/atoms/search/SuggestedPeopleBySearchItem/SuggestedPeopleBySearchItem';
import {
	useCheckRelationships,
	useGetSuggestedPeople,
} from '@/hooks/queries/profile.queries';
import Underline from '@/components/atoms/common/Underline/Underline';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '@/types/navigation';
import { isTablet } from '@/util/helper/isTablet';
import { AccountListIcon } from '@/util/svg/icon.common';
import { generateAppopirateColor } from '@/util/helper/helper';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

const SuggestedPeopleBySearch = () => {
	const { t } = useTranslation();
	const navigation = useNavigation<StackNavigationProp<SearchStackParamList>>();
	const { colorScheme } = useColorScheme();
	const { data: suggestedPeople, isLoading: suggestedPeopleLoading } =
		useGetSuggestedPeople({ limit: 10 });

	const accountIds = useMemo(
		() => suggestedPeople?.map(people => people.account.id) || [],
		[suggestedPeople],
	);

	// ***** Check Relationship To Other Accounts ***** //
	const { data: relationships } = useCheckRelationships({
		accountIds: accountIds,
		options: {
			enabled: accountIds.length > 0,
		},
	});
	// ***** Check Relationship To Other Accounts ***** //

	const relationshipsMap = useMemo(() => {
		if (!relationships) return new Map();
		return new Map(relationships?.map(rel => [rel.id, rel]));
	}, [relationships]);

	const renderItem = useCallback(
		({ item }: { item: Patchwork.SuggestedPeople }) => {
			return (
				<SuggestedPeopleBySearchItem
					item={item}
					relationship={relationshipsMap.get(item.account.id)}
					accountIds={accountIds}
				/>
			);
		},
		[relationshipsMap],
	);

	const suggestedPeoplePreviewLimit = isTablet ? 7 : 5;

	return (
		<View className="mx-4">
			<View className="flex-row items-center justify-between my-3">
				{suggestedPeople && suggestedPeople?.length > 0 && (
					<ThemeText className="font-NewsCycle_Bold" size="lg_18">
						{t('common.people_to_follow')}
					</ThemeText>
				)}
				{suggestedPeople && suggestedPeople?.length > 5 && (
					<Pressable
						onPress={() => navigation.navigate('SuggestedPeopleList')}
						className="active:opacity-80"
					>
						<ThemeText
							variant={'textGrey'}
							className="font-Inter_Regular text-right"
						>
							{t('common.view_all')}
						</ThemeText>
					</Pressable>
				)}
			</View>
			{suggestedPeopleLoading ? (
				<View className="flex-1 items-center justify-center my-4">
					<Flow
						size={30}
						color={
							colorScheme === 'dark'
								? customColor['patchwork-primary-dark']
								: customColor['patchwork-primary']
						}
					/>
				</View>
			) : !suggestedPeople || suggestedPeople?.length === 0 ? (
				<View className="flex-1 items-center justify-center mt-16">
					<AccountListIcon
						stroke={generateAppopirateColor({ light: '#000', dark: '#fff' })}
					/>
					<ThemeText size={'sm_14'} className="text-center mt-4 tracking-wider">
						{t('search.no_suggestion_found')}
					</ThemeText>
				</View>
			) : (
				<>
					<FlatList
						data={suggestedPeople?.slice(0, suggestedPeoplePreviewLimit)}
						horizontal
						showsHorizontalScrollIndicator={false}
						renderItem={renderItem}
						keyExtractor={item => item.account.id}
					/>
					{suggestedPeople && suggestedPeople?.length > 0 && (
						<Underline className="mt-4" />
					)}
				</>
			)}
		</View>
	);
};

export default SuggestedPeopleBySearch;
