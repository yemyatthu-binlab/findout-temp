import NewsmastPeopleToFollowItem from '@/components/atoms/channel/NewsmastPeopleToFollowItem/NewsmastPeopleToFollowItem';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Underline from '@/components/atoms/common/Underline/Underline';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import {
	useGetNewsmastCommunityDetailBio,
	useGetNewsmastCommunityPeopleToFollow,
} from '@/hooks/queries/channel.queries';
import { useActiveDomainStore } from '@/store/feed/activeDomain';
import { HomeStackScreenProps } from '@/types/navigation';
import customColor from '@/util/constant/color';
import { ChevronRightIcon } from '@/util/svg/icon.common';
import { useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { debounce } from 'lodash';
import { useColorScheme } from 'nativewind';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { CircleFade, Flow } from 'react-native-animated-spinkit';
import { FlatList } from 'react-native-gesture-handler';

const NMChannelAllHashtagList = ({
	navigation,
	route,
}: HomeStackScreenProps<'NMChannelAllHashtagList'>) => {
	const { slug } = route.params;
	const { colorScheme } = useColorScheme();
	const [currentPage, setCurrentPage] = useState(1);
	const { domain_name } = useActiveDomainStore();
	const { t } = useTranslation();
	const slugWithDash = slug.replace(/_/g, '-');

	const { data: newsmastCommunityDetailBio, isLoading } =
		useGetNewsmastCommunityDetailBio({ id: slugWithDash });

	const renderItem = useCallback(
		({ item }: { item: Patchwork.PatchworkCommunityHashtag }) => {
			const navigateToHashTagDetail = (name: string) => {
				navigation.navigate('HashTagDetail', {
					hashtag: item.name,
					hashtagDomain: domain_name,
				});
			};
			return (
				<Pressable
					key={item.name}
					onPress={() => navigateToHashTagDetail(item.name)}
				>
					<View className="flex-row items-center my-2">
						<View className="flex-1">
							<ThemeText size="md_16">#{item.name}</ThemeText>
						</View>
						<ChevronRightIcon />
					</View>
				</Pressable>
			);
		},
		[],
	);

	return (
		<SafeScreen>
			<View className="flex-1">
				<Header
					title={t('screen.community_hashtags')}
					leftCustomComponent={<BackButton />}
					underlineClassName="mb-0"
				/>

				{isLoading ? (
					<View className="flex-1 justify-center items-center">
						<Flow
							size={50}
							color={
								colorScheme === 'dark'
									? customColor['patchwork-primary-dark']
									: customColor['patchwork-primary']
							}
						/>
					</View>
				) : (
					<View className="mx-8 mb-[100]">
						<FlatList
							data={
								newsmastCommunityDetailBio?.attributes
									?.patchwork_community_hashtags
							}
							renderItem={renderItem}
							// keyExtractor={item => item.id}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				)}
			</View>
		</SafeScreen>
	);
};

export default NMChannelAllHashtagList;
