import { useCallback, useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useCheckRelationships } from '@/hooks/queries/profile.queries';
import Underline from '@/components/atoms/common/Underline/Underline';
import SearchedUserSuggestion from '@/components/atoms/search/SearchedUserSuggestion/SearchedUserSuggestion';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '@/types/navigation';
import { queryClient } from '@/App';
import { CheckRelationshipQueryKey } from '@/types/queries/profile.type';
import { useTranslation } from 'react-i18next';

interface SuggestedPeopleBySearchResultProps {
	searchedSuggestedPeople: Patchwork.Account[];
	q: string;
}

const SuggestedPeopleBySearchResult = ({
	searchedSuggestedPeople,
	q,
}: SuggestedPeopleBySearchResultProps) => {
	const { t } = useTranslation();
	const navigation = useNavigation<StackNavigationProp<SearchStackParamList>>();

	const accountIds = useMemo(
		() => searchedSuggestedPeople?.map(people => people.id) || [],
		[searchedSuggestedPeople],
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

	const notFollowing = searchedSuggestedPeople.filter(p => {
		const rel = relationshipsMap.get(p.id);
		return !rel || !rel.following;
	});

	const following = searchedSuggestedPeople.filter(p => {
		const rel = relationshipsMap.get(p.id);
		return rel && rel.following;
	});

	const renderItem = useCallback(
		({ item }: { item: Patchwork.Account }) => {
			return (
				<SearchedUserSuggestion
					item={item}
					relationship={relationshipsMap.get(item.id)}
					accountIds={accountIds}
				/>
			);
		},
		[relationshipsMap],
	);

	const relationshipQueryKey: CheckRelationshipQueryKey = [
		'check-relationship-to-other-accounts',
		{ accountIds: accountIds },
	];

	useFocusEffect(
		useCallback(() => {
			queryClient.invalidateQueries({ queryKey: relationshipQueryKey });
		}, []),
	);

	return (
		<>
			{searchedSuggestedPeople.length > 0 ? (
				<View className="mx-4 mt-4">
					<Pressable className="flex-row items-center justify-between mb-3">
						<ThemeText className="font-NewsCycle_Bold" size="lg_18">
							{t('common.people')}
						</ThemeText>
						{searchedSuggestedPeople.length > 5 && (
							<Pressable
								onPress={() =>
									navigation.navigate('SearchedAccountList', { q })
								}
							>
								<ThemeText variant={'textGrey'} className="text-right">
									{t('common.view_all')}
								</ThemeText>
							</Pressable>
						)}
					</Pressable>

					<FlatList
						data={notFollowing.slice(0, 5)}
						horizontal
						showsHorizontalScrollIndicator={false}
						renderItem={renderItem}
						keyExtractor={item => item.id}
					/>
					{following.length > 0 && (
						<>
							<View className="flex-row items-center justify-between mt-4 mb-3">
								<ThemeText className="font-NewsCycle_Bold" size="lg_18">
									{t('timeline.following')}
								</ThemeText>
							</View>

							<FlatList
								data={following.slice(0, 5)}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={renderItem}
								keyExtractor={item => item.id}
							/>
						</>
					)}
					<Underline className="mt-4" />
				</View>
			) : (
				<></>
			)}
		</>
	);
};

export default SuggestedPeopleBySearchResult;
