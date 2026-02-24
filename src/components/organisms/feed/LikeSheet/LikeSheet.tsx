import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useLiveVideoFeedStore } from '@/store/ui/liveVideoFeedStore';
import { View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppIcons } from '@/util/icons/icon.common';
import customColor from '@/util/constant/color';

export const LikeSheet = () => {
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const { isLikeSheetOpen: isOpen, closeLikeSheet } = useLiveVideoFeedStore();
	const snapPoints = useMemo(() => ['85%'], []);
	const { colorScheme } = useColorScheme();

	useEffect(() => {
		if (isOpen) {
			bottomSheetRef.current?.present();
		} else {
			bottomSheetRef.current?.dismiss();
		}
	}, [isOpen]);

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

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			onDismiss={closeLikeSheet}
			backdropComponent={renderBackdrop}
			enablePanDownToClose
			backgroundStyle={{
				backgroundColor:
					colorScheme === 'dark' ? customColor['patchwork-dark-100'] : 'white',
			}}
			handleIndicatorStyle={{
				backgroundColor: colorScheme === 'dark' ? '#555' : '#ccc',
			}}
		>
			<BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
				<View className="justify-center items-center h-[300] -mt-10">
					<FontAwesomeIcon
						icon={AppIcons.developing}
						size={50}
						color={
							colorScheme == 'dark' ? '#fff' : customColor['patchwork-primary']
						}
					/>
					<ThemeText className="text-lg font-NewsCycle_Bold mb-4 text-center mt-3">
						This feature is still under development. {'\n'} Thanks for checking
						it out!
					</ThemeText>
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
};
