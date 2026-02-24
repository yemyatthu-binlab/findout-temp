import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '@/types/navigation';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Image from '@/components/atoms/common/Image/Image';
import Underline from '@/components/atoms/common/Underline/Underline';
import { extractArticlePreview } from '@/util/helper/helper';
import StatusHeader from '@/components/atoms/feed/StatusHeader/StatusHeader';
import StatusActionBar from '@/components/molecules/feed/StatusActionBar/StatusActionBar';

type Props = {
	status: Patchwork.Status;
};

const ArticleItem = ({ status }: Props) => {
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { title, excerpt } = extractArticlePreview(status.content);
	const coverImage = status.media_attachments?.[0]?.url;

	const handlePress = () => {
		navigation.push('ArticleDetail', { status });
	};

	return (
		<>
			<View className="mx-2 my-4">
				<Pressable onPress={handlePress} className="rounded-lg">
					<View className="px-3">
						<StatusHeader
							imageSize="w-9 h-9"
							status={status}
							isFromNoti={false}
							showAvatarIcon
							className="mb-4"
						/>

						<View className="flex-row justify-between">
							<View className={`flex-1 ${coverImage ? 'mr-2' : ''}`}>
								<ThemeText
									className="font-NewsCycle_Bold mb-1"
									numberOfLines={3}
								>
									{title}
								</ThemeText>
							</View>

							{coverImage && (
								<Image
									source={{ uri: coverImage }}
									className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-600 -mt-4"
									resizeMode="cover"
								/>
							)}
						</View>
						<ThemeText
							className="text-gray-500 dark:text-gray-400 mt-3"
							numberOfLines={coverImage ? 4 : 6}
						>
							{excerpt}
						</ThemeText>
					</View>

					<View className="mt-1 px-4">
						<StatusActionBar status={status} />
					</View>
				</Pressable>
			</View>
			<Underline />
		</>
	);
};

export default ArticleItem;
