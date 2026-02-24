import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getPalette } from '@somesoap/react-native-image-palette';
import Image from '@/components/atoms/common/Image/Image';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import WpDefaultAvatar from '@/components/molecules/blog/WpDefaultAvatar/WpDefaultAvatar';
import customColor from '@/util/constant/color';
import he from 'he';
import { HomeStackParamList } from '@/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { formatAuthorName } from '@/util/helper/helper';

const HEADER_HEIGHT = 320;
const AVATAR_TOP_OFFSET = 140;

const WpAuthorDetailHeader = ({
	author,
	authorAvatarUrl,
	authorDescription,
	isLoadingAuthor,
	isLoadingAvatarInfo,
	safeAreaTop,
	isDark,
	metaColor,
	solidHeaderBg,
}: {
	author: Patchwork.WPUser | undefined;
	authorAvatarUrl: string | undefined;
	authorDescription: string | undefined;
	isLoadingAuthor: boolean;
	isLoadingAvatarInfo: boolean;
	safeAreaTop: number;
	isDark: boolean;
	metaColor: string;
	solidHeaderBg: string;
}) => {
	const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const [paletteColors, setPaletteColors] = useState<string[]>([]);

	useEffect(() => {
		if (authorAvatarUrl) extractPalette();
		else applyFallbackGradient();
	}, [authorAvatarUrl, isDark]);

	const extractPalette = async () => {
		try {
			const palette = await getPalette(authorAvatarUrl || '');
			const gradientColors =
				palette?.vibrant && palette?.muted
					? [palette.vibrant, palette.muted]
					: ['#7F7F7F', '#8C8C8C'];
			setPaletteColors(gradientColors);
		} catch {
			applyFallbackGradient();
		}
	};

	const applyFallbackGradient = () => {
		setPaletteColors(['#7F7F7F', '#8C8C8C']);
	};

	return (
		<View
			className="mb-4 overflow-hidden"
			style={{ height: HEADER_HEIGHT + safeAreaTop }}
		>
			{/* Dynamic gradient background */}
			<LinearGradient
				colors={paletteColors.length > 0 ? paletteColors : ['#000', '#333']}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				}}
			/>
			<LinearGradient
				colors={['transparent', solidHeaderBg]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				}}
			/>

			<View style={{ paddingTop: safeAreaTop }}>
				<View className="items-center px-4">
					<View style={{ marginTop: AVATAR_TOP_OFFSET - 50 }}>
						{isLoadingAuthor || isLoadingAvatarInfo ? (
							<View className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600" />
						) : authorAvatarUrl ? (
							<Pressable
								onPress={() =>
									navigation.navigate('ImageViewer', {
										id: authorAvatarUrl,
										imageUrls: [{ id: authorAvatarUrl, url: authorAvatarUrl }],
									})
								}
							>
								<Image
									source={{ uri: authorAvatarUrl }}
									className="w-24 h-24 rounded-full border border-white"
								/>
							</Pressable>
						) : (
							<View className="border border-white rounded-full">
								<WpDefaultAvatar
									name={author?.name || 'A'}
									size={96}
									backgroundColor="#fff"
									textColor={'#000'}
								/>
							</View>
						)}
					</View>

					<ThemeText className="text-2xl font-NewsCycle_Bold text-center mt-4">
						{formatAuthorName(author?.name || '')}
					</ThemeText>

					{authorDescription && (
						<ThemeText
							className="text-center my-2 text-xs"
							style={{ color: metaColor }}
						>
							{he.decode(authorDescription)}
						</ThemeText>
					)}
				</View>
			</View>
		</View>
	);
};

export default WpAuthorDetailHeader;
