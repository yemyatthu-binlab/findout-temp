import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import Underline from '@/components/atoms/common/Underline/Underline';
import SuggestedPeopleListItem from '@/components/organisms/search/SuggestedPeopleListItem/SuggestedPeopleListItem';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import {
	useCheckRelationships,
	useGetSuggestedPeople,
} from '@/hooks/queries/profile.queries';
import customColor from '@/util/constant/color';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';

const SuggestedPeopleList = () => {
	const { t } = useTranslation();
	const { data: suggestedPeople, isLoading: suggestedPeopleLoading } =
		useGetSuggestedPeople({ limit: 10 });
	const { colorScheme } = useColorScheme();
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
				<SuggestedPeopleListItem
					item={item}
					relationship={relationshipsMap.get(item.account.id)}
					accountIds={accountIds}
				/>
			);
		},
		[relationshipsMap],
	);

	return (
		<SafeScreen>
			<View className="flex-1">
				<Header
					title={t('screen.people_to_follow')}
					leftCustomComponent={<BackButton />}
					underlineClassName="mb-0"
				/>

				{suggestedPeopleLoading ? (
					<View className="flex-1 justify-center items-center">
						<Flow
							size={50}
							color={
								colorScheme == 'dark'
									? customColor['patchwork-primary-dark']
									: '#000'
							}
						/>
					</View>
				) : (
					<FlashList
						data={suggestedPeople}
						extraData={[]}
						keyExtractor={item => item.account.id}
						renderItem={renderItem}
						ItemSeparatorComponent={Underline}
						showsVerticalScrollIndicator={false}
						getItemType={item => {
							return item.account.id;
						}}
					/>
				)}
			</View>
		</SafeScreen>
	);
};

export default SuggestedPeopleList;
