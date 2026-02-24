// src/components/molecules/blog/WpAuthorAvatarWithExtras/WpAuthorAvatarWithExtras.tsx

import React from 'react';
import { Pressable, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { useGetWordpressAuthorExtras } from '@/hooks/queries/wpFeed.queries'; // The hook we created
import { HomeStackParamList } from '@/types/navigation';
import WpDefaultAvatar from '@/components/molecules/blog/WpDefaultAvatar/WpDefaultAvatar';
import Image from '@/components/atoms/common/Image/Image';
import customColor from '@/util/constant/color';
import { formatAuthorSlug } from '@/util/helper/helper';

interface AuthorProps {
	author: {
		id: string;
		link: string;
		name: string;
	};
	index: number;
}

const WpAuthorAvatar: React.FC<AuthorProps> = ({ author, index }) => {
	const { colorScheme } = useColorScheme();
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const isDark = colorScheme === 'dark';

	const { data: authorExtras, isLoading: isLoadingAvatarInfo } =
		useGetWordpressAuthorExtras(formatAuthorSlug(author.name));

	const defaultAvatarBgColor =
		colorScheme === 'dark'
			? customColor['patchwork-primary-dark'].replace('#', '')
			: customColor['patchwork-primary'].replace('#', '');

	const authorAvatarUrl = authorExtras?.imageUrl || '';

	return (
		<Pressable
			key={author.id}
			onPress={() =>
				navigation.navigate('AuthorDetail', {
					authorId: parseInt(author.id),
					authorName: author.name,
				})
			}
			className="border-2 rounded-full border-white dark:border-patchwork-dark-100"
			style={{
				marginLeft: index > 0 ? -16 : 0,
			}}
		>
			{isLoadingAvatarInfo ? (
				<View className="w-11 h-11 rounded-full bg-gray-300 dark:bg-gray-600" />
			) : authorAvatarUrl ? (
				<Image
					source={{ uri: authorAvatarUrl }}
					className="w-11 h-11 rounded-full"
				/>
			) : (
				<WpDefaultAvatar
					name={author.name || 'Unknown'}
					size={44}
					backgroundColor={`#${defaultAvatarBgColor}`}
					textColor={colorScheme === 'dark' ? '#000000' : '#ffffff'}
				/>
			)}
		</Pressable>
	);
};

export default WpAuthorAvatar;
