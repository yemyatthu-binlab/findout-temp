import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import WpAuthorAvatar from '@/components/molecules/home/WpAuthorAvatar/WpAuthorAvatar';
import { formatAuthorName } from '@/util/helper/helper';
import { HomeStackParamList } from '@/types/navigation';
import { isTablet } from '@/util/helper/isTablet';

interface WpStoryAuthorListProps {
	authors: any[];
}

const WpStoryAuthorList = ({ authors }: WpStoryAuthorListProps) => {
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

	if (!authors || authors.length === 0) return null;

	return (
		<View className="mb-6">
			<View className="flex-row items-center mb-2 mt-3">
				<View className="flex-row pr-3">
					{authors.slice(0, 3).map((author, index) => (
						<WpAuthorAvatar key={author.id} author={author} index={index} />
					))}
				</View>

				<View className="flex-1">
					<ThemeText
						className={
							isTablet
								? 'font-NewsCycle_Bold text-lg'
								: 'font-NewsCycle_Bold text-base'
						}
					>
						{authors.map((author, index) => (
							<ThemeText
								key={author.id}
								onPress={() => {
									navigation.navigate('AuthorDetail', {
										authorId: parseInt(author?.id),
										authorName: author?.name,
									});
								}}
								className={isTablet ? 'text-base' : 'text-sm'}
							>
								{formatAuthorName(author.name)}
								{index < authors.length - 2 && ', '}
								{index === authors.length - 2 && ' and '}
							</ThemeText>
						))}
					</ThemeText>
				</View>
			</View>
		</View>
	);
};

export default WpStoryAuthorList;
