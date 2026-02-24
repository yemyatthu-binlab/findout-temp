import { Dimensions, RefreshControl, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import Underline from '@/components/atoms/common/Underline/Underline';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import customColor from '@/util/constant/color';
import { FlashList } from '@shopify/flash-list';
import { useColorScheme } from 'nativewind';
import { useGetScheduleList } from '@/hooks/queries/feed.queries';
import ScheduleItem from '@/components/atoms/compose/SchdeuleItem/ScheduleItem';
import { ComposeStatusProvider } from '@/context/composeStatusContext/composeStatus.context';
import { useManageAttachmentActions } from '@/store/compose/manageAttachments/manageAttachmentStore';
import { useNavigation } from '@react-navigation/native';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import { Button } from '@/components/atoms/common/Button/Button';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { ScheduleIcon } from '@/util/svg/icon.compose';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingStackParamList } from '@/types/navigation';

const ScheduledPostListInner = () => {
	const navigation =
		useNavigation<StackNavigationProp<SettingStackParamList>>();
	const { colorScheme } = useColorScheme();
	const { resetAttachmentStore } = useManageAttachmentActions();
	const { t } = useTranslation();

	const { data: scheduleList, isFetching, refetch } = useGetScheduleList();

	const onItemPress = (schedule: Patchwork.Schedule) => {
		resetAttachmentStore();
		navigation.navigate('Compose', {
			type: 'schedule',
			scheduledStatus: schedule,
		});
	};

	const onPressNewPost = () => {
		resetAttachmentStore();
		navigation.navigate('Compose', {
			type: 'schedule',
			scheduledStatus: null,
		});
	};

	return (
		<SafeScreen>
			<>
				<Header
					title={t('screen.scheduled_posts')}
					leftCustomComponent={<BackButton />}
					rightCustomComponent={
						scheduleList && scheduleList.length > 0 ? (
							<Button
								variant={'outline'}
								className="rounded-full aspect-square"
								onPress={onPressNewPost}
							>
								<ScheduleIcon width={20} height={20} {...{ colorScheme }} />
							</Button>
						) : (
							<></>
						)
					}
					hideUnderline
				/>
				<Underline />
				{scheduleList ? (
					<FlashList
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							paddingBottom: 20,
							paddingHorizontal: 20,
						}}
						keyExtractor={(item, index) => `${item.id}-${index}`}
						data={scheduleList}
						renderItem={({ item, index }) => (
							<ScheduleItem
								schedule={item}
								index={index}
								onClose={() => {}}
								onItemPressFromSetting={onItemPress}
							/>
						)}
						ItemSeparatorComponent={Underline}
						ListEmptyComponent={
							<View>
								<ListEmptyComponent title={t('compose.schedule.no_schedule')} />
								<Button
									variant="default"
									className="mt-6 self-center"
									onPress={onPressNewPost}
								>
									<ThemeText className="text-white dark:text-white">
										{t('compose.schedule.schedule_new_post')}
									</ThemeText>
								</Button>
							</View>
						}
						refreshControl={
							<RefreshControl
								refreshing={isFetching}
								tintColor={colorScheme == 'dark' ? 'white' : 'black'}
								onRefresh={() => {
									refetch();
								}}
							/>
						}
						getItemType={item => {
							return item.id;
						}}
					/>
				) : (
					<View className="flex-1 items-center justify-center">
						<Flow
							size={50}
							color={
								colorScheme === 'dark'
									? customColor['patchwork-primary-dark']
									: customColor['patchwork-primary']
							}
						/>
					</View>
				)}
			</>
		</SafeScreen>
	);
};

const ScheduledPostList = () => (
	<ComposeStatusProvider type="schedule">
		<ScheduledPostListInner />
	</ComposeStatusProvider>
);

export default ScheduledPostList;
