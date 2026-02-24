import { View, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSearchGif } from '@/hooks/queries/feed.queries';
import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { SearchIcon } from '@/util/svg/icon.common';
import { Flow } from 'react-native-animated-spinkit';
import Image from '@/components/atoms/common/Image/Image';
import useDebounce from '@/hooks/custom/useDebounce';
import customColor from '@/util/constant/color';
import { useManageAttachmentActions } from '@/store/compose/manageAttachments/manageAttachmentStore';
import { isTablet } from '@/util/helper/isTablet';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

type Props = {
	visibility: boolean;
	onClose: () => void;
};
const GifPickerModal = ({ visibility, onClose }: Props) => {
	const { t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState('');
	const [finalKeyword, setFinalKeyword] = useState(searchQuery);
	const { data: gifs, isLoading } = useSearchGif(finalKeyword);
	const startDebounce = useDebounce();
	const { colorScheme } = useColorScheme();
	const { onSelectMedia, onAddMedia } = useManageAttachmentActions();

	useEffect(() => {
		startDebounce(() => {
			setFinalKeyword(searchQuery);
		}, 500);
	}, [searchQuery]);

	const handleGifSelect = (gif: Patchwork.GifRes) => {
		onAddMedia({
			uri: gif?.media_formats?.tinygif?.url,
			type: 'image/gif',
			fileName: gif.id + '.gif',
		});
	};

	return (
		<ThemeModal
			onClose={onClose}
			type="simple"
			position="normal"
			visible={visibility}
			title={t('compose.search_gif')}
		>
			<View className="flex-1 p-1">
				<TextInput
					placeholder={t('compose.search_tenor')}
					extraContainerStyle="h-11"
					startIcon={<SearchIcon />}
					onChangeText={str => setSearchQuery(str)}
					value={searchQuery}
					autoCapitalize="none"
				/>
				{isLoading && (
					<View className="flex-1 justify-center items-center my-5">
						<Flow
							size={25}
							className="my-4"
							color={
								colorScheme === 'dark'
									? customColor['patchwork-primary-dark']
									: customColor['patchwork-primary']
							}
						/>
					</View>
				)}
				<FlatList
					data={gifs}
					keyExtractor={item => item.id}
					className="mt-2"
					numColumns={isTablet ? 4 : 2}
					renderItem={({ item }) => (
						<Pressable
							className="flex-1 aspect-square my-1 mx-0.5"
							onPress={() => {
								handleGifSelect(item);
								onClose();
							}}
						>
							<Image
								source={{
									uri:
										// item.media_formats?.tinygifpreview.url ||
										item.media_formats?.tinygif?.url ||
										item.media_formats?.gifpreview.url ||
										item.media_formats?.gif?.url,
								}}
								className="w-full h-full rounded"
							/>
						</Pressable>
					)}
				/>
			</View>
		</ThemeModal>
	);
};

export default GifPickerModal;
