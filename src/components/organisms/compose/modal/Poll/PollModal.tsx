import React, { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import ThemeModal from '@/components/atoms/common/Modal/Modal';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useGradualAnimation } from '@/hooks/custom/useGradualAnimation';
import { usePollState } from '@/hooks/custom/usePollState';
import { keyExtractor } from '@/util/helper/helper';
import { POLL_LIMITS } from '@/util/constant/pollOption';
import PollOption from '@/components/molecules/compose/Poll/PollOption';
import { useTranslation } from 'react-i18next';

interface PollModalProps {
	visible: boolean;
	onClose: () => void;
}

const PollModal = ({ visible, onClose }: PollModalProps) => {
	const { t } = useTranslation();
	const [durationMenuVisible, setDurationMenuVisible] = useState(false);
	const hideMenu = () => setDurationMenuVisible(false);
	const showMenu = () => setDurationMenuVisible(true);

	const {
		options,
		duration,
		addOption,
		removeOption,
		updateOption,
		handleDurationSelect,
	} = usePollState();

	const { height } = useGradualAnimation();

	const pollDurationAnimatedViewStyle = useAnimatedStyle(() => {
		return {
			height: Math.abs(height.value),
		};
	});

	return (
		<ThemeModal
			isFlex
			openThemeModal={visible}
			parentPaddingEnabled={false}
			containerStyle={{ borderRadius: 24 }}
		>
			<View className="flex-1 pt-2">
				<View className="flex-row items-center justify-between px-5">
					<Pressable onPress={onClose}>
						<ThemeText>{t('common.cancel')}</ThemeText>
					</Pressable>
					<Pressable
						onPress={() => {
							onClose();
						}}
					>
						<ThemeText variant={'textPrimary'}>{t('common.create')}</ThemeText>
					</Pressable>
				</View>

				{/* Poll Body */}
				<View className="flex-1 px-5">
					<View className="mt-3">
						{/* Poll Options */}
						<FlatList
							data={options}
							keyExtractor={keyExtractor}
							keyboardShouldPersistTaps={'always'}
							renderItem={({ item, index }) => (
								<PollOption
									key={index}
									value={item}
									index={index}
									canRemove={options.length > POLL_LIMITS.MIN_OPTIONS}
									onChangeText={updateOption}
									onRemove={removeOption}
								/>
							)}
							// ListHeaderComponent={PollListHeaderComponent}
							// ListFooterComponent={() => (
							// 	<PollListFooterComponent
							// 		isDisabled={options.length === POLL_LIMITS.MAX_OPTIONS}
							// 		addOption={addOption}
							// 	/>
							// )}
						/>
					</View>
				</View>

				{/* Poll Body */}
				<View className="w-full flex-row items-center justify-between px-5 py-3 bg-patchwork-dark-400">
					<ThemeText>{t('compose.poll_duration')}</ThemeText>
					{/* <PollDuration
						durationMenuVisible={durationMenuVisible}
						showMenu={showMenu}
						hideMenu={hideMenu}
						selectedDuration={duration}
						handleDurationSelect={handleDurationSelect}
					/> */}
				</View>
				<Animated.View style={pollDurationAnimatedViewStyle} />
			</View>
		</ThemeModal>
	);
};

export default PollModal;
