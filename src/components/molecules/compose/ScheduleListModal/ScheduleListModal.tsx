import { View, FlatList, Dimensions } from 'react-native';
import React from 'react';
import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Flow } from 'react-native-animated-spinkit';
import customColor from '@/util/constant/color';
import { useGetScheduleList } from '@/hooks/queries/feed.queries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScheduleItem from '@/components/atoms/compose/SchdeuleItem/ScheduleItem';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

type Props = {
	onClose: () => void;
};
const ScheduleListModal = ({ onClose }: Props) => {
	const { t } = useTranslation();
	const { top } = useSafeAreaInsets();
	const { colorScheme } = useColorScheme();
	const modalHeight = Dimensions.get('window').height - top;
	const { data: scheduleList, isLoading } = useGetScheduleList();
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
				{scheduleList && (
					<FlatList
						data={scheduleList}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={() => {
							return (
								<ThemeText variant="textPrimary" className="text-center">
									{t('compose.schedule.no_schedule')}
								</ThemeText>
							);
						}}
						renderItem={({ item, index }) => (
							<ScheduleItem schedule={item} index={index} onClose={onClose} />
						)}
						keyExtractor={item => item.id}
						showsHorizontalScrollIndicator={false}
					/>
				)}
				{isLoading && (
					<View className="flex-1 items-center justify-center">
						<Flow
							size={30}
							color={
								colorScheme === 'dark'
									? customColor['patchwork-primary-dark']
									: customColor['patchwork-primary']
							}
						/>
					</View>
				)}
			</View>
		</ThemeModal>
	);
};

export default ScheduleListModal;
