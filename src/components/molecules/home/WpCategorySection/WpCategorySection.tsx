import { useGetWordpressPostsByCategoryId } from '@/hooks/queries/wpFeed.queries';
import { View, FlatList } from 'react-native';
import WpSectionHeader from '../WpSectionHeader/WpSectionHeader';
import { WpstoryCard } from '../WpStoryCard/WpStoryCard';
import { WpListItem } from '../WpListItem/WpListItem';
import {
	HorizontalSkeleton,
	VerticalSkeleton,
} from '@/components/atoms/loading/WpStoryLoading';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import { isTablet } from '@/util/helper/isTablet';

interface CategorySectionProps {
	title: string;
	categoryId?: number;
	layout: 'horizontal' | 'vertical';
	limit?: number;
}

export const WpCategorySection = ({
	title,
	categoryId,
	layout,
	limit = 5,
}: CategorySectionProps) => {
	const {
		data: posts,
		isLoading,
		isError,
	} = useGetWordpressPostsByCategoryId({ categoryId: categoryId!, limit });
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

	const handleViewAll = () => {
		navigation.navigate('WpCategoryViewAll', {
			categoryId: categoryId,
			title: title,
			categoryType: layout === 'horizontal' ? 'card' : 'list',
		});
	};

	if (isLoading) {
		return (
			<View>
				<WpSectionHeader title={title} />
				{layout === 'horizontal' ? (
					<HorizontalSkeleton />
				) : (
					<VerticalSkeleton />
				)}
			</View>
		);
	}

	if (isError || !posts || posts.length === 0) {
		return null;
	}

	return (
		<View>
			<WpSectionHeader title={title} onViewAll={handleViewAll} />
			{layout === 'horizontal' ? (
				<FlatList
					data={posts}
					renderItem={({ item }) => <WpstoryCard post={item} />}
					keyExtractor={item => item.id.toString()}
					horizontal
					showsHorizontalScrollIndicator={false}
				/>
			) : (
				<View>
					{posts.map(post => (
						<WpListItem key={post.id} post={post} isImageTakeHalfWidth />
					))}
				</View>
			)}
		</View>
	);
};
