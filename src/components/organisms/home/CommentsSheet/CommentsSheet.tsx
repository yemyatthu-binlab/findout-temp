import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { View, Keyboard, Pressable } from 'react-native';
import {
	BottomSheetModal,
	BottomSheetFlatList,
	BottomSheetTextInput,
	BottomSheetFooter,
	BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useLiveVideoFeedStore } from '@/store/ui/liveVideoFeedStore';
import { useColorScheme } from 'nativewind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import he from 'he';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useGetWordpressCommentsByPostId } from '@/hooks/queries/wpFeed.queries';
import customColor from '@/util/constant/color';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';

export const CommentsSheet = () => {
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const {
		isCommentSheetOpen: isOpen,
		closeComments,
		commentPostId: postId,
	} = useLiveVideoFeedStore();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const insets = useSafeAreaInsets();
	const [currentSnapIndex, setCurrentSnapIndex] = useState(-1);
	const snapPoints = useMemo(() => ['65%', '100%'], []);

	const { data: comments = [] } = useGetWordpressCommentsByPostId(
		postId || 0,
		isOpen && !!postId,
	);

	useEffect(() => {
		if (isOpen) {
			bottomSheetRef.current?.present();
		} else {
			bottomSheetRef.current?.dismiss();
			Keyboard.dismiss();
		}
	}, [isOpen]);

	const handleSheetChanges = useCallback(
		(index: number) => {
			setCurrentSnapIndex(index);
			if (index === -1) {
				closeComments();
			}
		},
		[closeComments],
	);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.5}
				pressBehavior="close"
			/>
		),
		[],
	);

	const renderFooter = useCallback(
		(props: any) => (
			<BottomSheetFooter {...props} bottomInset={0}>
				<View
					className="px-4 pt-2.5 border-t border-gray-100/10 bg-[#fff] dark:bg-[#1a1a1a]"
					style={{
						paddingBottom: insets.bottom,
					}}
				>
					<View className="flex-row items-center rounded-full px-1 py-1 h-11 bg-[#f0f0f0] dark:bg-[#333333]">
						<BottomSheetTextInput
							placeholder="Add comment..."
							placeholderTextColor={isDark ? '#999' : '#666'}
							style={{
								color: isDark ? 'white' : 'black',
								flex: 1,
								height: 40,
								marginLeft: 12,
							}}
							onFocus={() => bottomSheetRef.current?.snapToIndex(1)}
						/>
						<Pressable className="w-8 h-8 rounded-full bg-black dark:bg-white items-center justify-center mr-1">
							<FontAwesomeIcon
								icon={faChevronRight}
								color={colorScheme === 'dark' ? 'black' : 'white'}
								size={16}
							/>
						</Pressable>
					</View>
				</View>
			</BottomSheetFooter>
		),
		[isDark, insets.bottom],
	);

	const renderItem = useCallback(
		({ item }: { item: Patchwork.WPComment }) => (
			<View className="flex-row mb-4 mt-2">
				<View className="w-8 h-8 rounded-full items-center justify-center mr-3 bg-[#eee] dark:bg-[#444]">
					<ThemeText className="text-sm font-semibold text-[#333] dark:text-white">
						{item.author_name.charAt(0).toUpperCase()}
					</ThemeText>
				</View>
				<View className="flex-1">
					<ThemeText className="font-semibold text-[13px] mb-0.5 text-[#333] dark:text-white">
						{item.author_name}
					</ThemeText>
					<ThemeText
						className="text-sm leading-[18px] mb-1"
						style={{ color: isDark ? 'white' : 'black' }}
					>
						{he.decode(item.content.rendered.replace(/<[^>]*>?/gm, ''))}
					</ThemeText>
					<View className="flex-row gap-4">
						<ThemeText className="text-xs text-[#888]">
							{moment(item.date).fromNow()}
						</ThemeText>
					</View>
				</View>
			</View>
		),
		[isDark],
	);

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			enablePanDownToClose
			onChange={handleSheetChanges}
			onDismiss={closeComments}
			backgroundStyle={{
				backgroundColor: isDark ? customColor['patchwork-dark-100'] : 'white',
			}}
			handleIndicatorStyle={{
				backgroundColor:
					currentSnapIndex === 1
						? isDark
							? '#000'
							: '#fff'
						: isDark
						? '#555'
						: '#ccc',
			}}
			keyboardBehavior="interactive"
			android_keyboardInputMode="adjustResize"
			footerComponent={renderFooter}
			backdropComponent={renderBackdrop}
		>
			<View className="flex-row justify-center items-center py-1.5 relative">
				<ThemeText
					className="font-bold text-sm"
					style={{ color: isDark ? 'white' : 'black' }}
				>
					{comments.length} comments
				</ThemeText>
			</View>

			<BottomSheetFlatList
				data={comments}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item: Patchwork.WPComment) => item.id.toString()}
				renderItem={renderItem}
				contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
				ListEmptyComponent={
					<View className="h-[500] w-full items-center justify-center">
						<ListEmptyComponent title="No comments found" />
					</View>
				}
			/>
		</BottomSheetModal>
	);
};
