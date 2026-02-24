import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useGetQuotedBy } from '@/hooks/queries/feed.queries';
import { useSelectedDomain } from '@/store/feed/activeDomain';
import { HomeStackScreenProps } from '@/types/navigation';
import customColor from '@/util/constant/color';
import { flattenPages } from '@/util/helper/timeline';
import { UserAccountIcon } from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';
import { View } from 'react-native';
import { CircleFade, Flow } from 'react-native-animated-spinkit';
import { useTranslation } from 'react-i18next';
import StatusWrapper from '@/components/organisms/feed/StatusWrapper/StatusWrapper';
import { FlashList } from '@shopify/flash-list';

const QuotedBy = ({ route }: HomeStackScreenProps<'QuotedBy'>) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const { id, uri } = route.params;
	const domain_name = useSelectedDomain();

	const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useGetQuotedBy({
			id,
			domain_name,
		});

	const quotedByList = useMemo(() => flattenPages(data), [data]);

	const renderItem = ({ item }: { item: Patchwork.Status }) => {
		return (
			<StatusWrapper
				status={item}
				currentPage="QuotedBy"
				statusType={item.reblog ? 'reblog' : 'normal'}
				extraPayload={{ domain_name }}
			/>
		);
	};

	const onLoadMore = () => {
		if (hasNextPage) {
			return fetchNextPage();
		}
	};

	return (
		<SafeScreen>
			<View className="flex-1">
				<Header
					title={t('screen.quoted_by') || 'Quoted By'}
					leftCustomComponent={<BackButton />}
					underlineClassName="mb-0"
				/>
				{isLoading ? (
					<View className="flex-1 justify-center items-center">
						<Flow size={50} color={customColor['patchwork-primary']} />
					</View>
				) : quotedByList.length === 0 ? (
					<View className="flex-1 justify-center items-center">
						<UserAccountIcon colorScheme={colorScheme} />
					</View>
				) : (
					<FlashList
						data={quotedByList}
						keyExtractor={item => item.id.toString()}
						renderItem={renderItem}
						showsVerticalScrollIndicator={false}
						onEndReached={onLoadMore}
						onEndReachedThreshold={0.15}
						ListFooterComponent={
							<View className="items-center my-5">
								{isFetchingNextPage ? (
									<CircleFade
										size={25}
										color={colorScheme === 'dark' ? '#fff' : '#000'}
									/>
								) : null}
							</View>
						}
					/>
				)}
			</View>
		</SafeScreen>
	);
};

export default QuotedBy;
