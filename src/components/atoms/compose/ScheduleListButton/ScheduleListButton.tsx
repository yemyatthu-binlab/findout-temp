import { useGetScheduleList } from '@/hooks/queries/feed.queries';
import { View, Pressable } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	onPressScheduleListBtn: () => void;
};

const ScheduleListButton = ({ onPressScheduleListBtn }: Props) => {
	const { t } = useTranslation();
	const { data: scheduleList, refetch: refetchScheduleList } =
		useGetScheduleList();

	useFocusEffect(
		useCallback(() => {
			refetchScheduleList();
		}, []),
	);

	return (
		<View>
			{scheduleList && scheduleList?.length > 0 && (
				<Pressable
					className="justify-end items-end m-2 active:opacity-80"
					onPress={onPressScheduleListBtn}
				>
					<ThemeText>{t('schedule')}</ThemeText>
				</Pressable>
			)}
		</View>
	);
};

export default ScheduleListButton;
