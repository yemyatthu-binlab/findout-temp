import { View, FlatList, Dimensions, Pressable } from 'react-native';
import React, { useState } from 'react';
import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Flow } from 'react-native-animated-spinkit';
import customColor from '@/util/constant/color';
import { useGetScheduleList } from '@/hooks/queries/feed.queries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScheduleItem from '@/components/atoms/compose/SchdeuleItem/ScheduleItem';
import Checkbox from '@/components/atoms/common/Checkbox/Checkbox';
import { SwitchOffIcon, SwitchOnIcon } from '@/util/svg/icon.common';
import { Button } from '@/components/atoms/common/Button/Button';
import { useTranslation } from 'react-i18next';

type Props = {
	onClose: () => void;
};
const FilterTimelineModal = ({ onClose }: Props) => {
	const { t } = useTranslation();
	const { top } = useSafeAreaInsets();

	const modalHeight = 320;
	const { data: scheduleList, isLoading } = useGetScheduleList();
	const [isChecked, setIsChecked] = useState(false);

	return (
		<ThemeModal
			type="alternative"
			hasNotch
			position="bottom"
			visible={true}
			onClose={onClose}
			modalHeight={modalHeight}
		>
			<View>
				<ThemeText className="font-NewsCycle_Bold" size="lg_18">
					{t('filter_setting')}
				</ThemeText>
				<View>
					<View className="ml-10 mr-2 mt-3 flex-row items-center justify-between active:opacity-80">
						<Pressable onPress={() => {}} className="flex-row items-center ">
							<ThemeText className="mr-5">{t('show_boosts')}</ThemeText>
						</Pressable>
						<>
							{true ? (
								<SwitchOnIcon width={42} onPress={() => {}} />
							) : (
								<SwitchOffIcon width={42} onPress={() => {}} />
							)}
						</>
					</View>
					<View className="ml-10 mr-2 mt-3 flex-row items-center justify-between active:opacity-80">
						<Pressable onPress={() => {}} className="flex-row items-center ">
							<ThemeText className="mr-5">{t('show_quotes')}</ThemeText>
						</Pressable>
						<>
							{true ? (
								<SwitchOnIcon width={42} onPress={() => {}} />
							) : (
								<SwitchOffIcon width={42} onPress={() => {}} />
							)}
						</>
					</View>
					<View className="ml-10 mr-2 mt-3 flex-row items-center justify-between active:opacity-80">
						<Pressable onPress={() => {}} className="flex-row items-center ">
							<ThemeText className="mr-5">{t('show_replies')}</ThemeText>
						</Pressable>
						<>
							{false ? (
								<SwitchOnIcon width={42} onPress={() => {}} />
							) : (
								<SwitchOffIcon width={42} onPress={() => {}} />
							)}
						</>
					</View>
					<Button onPress={() => {}} className="my-3 h-[48]">
						<ThemeText className="text-white dark:text-black">
							{t('common.apply')}
						</ThemeText>
					</Button>
				</View>
			</View>
		</ThemeModal>
	);
};

export default FilterTimelineModal;
//
