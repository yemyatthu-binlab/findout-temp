import { View } from 'react-native';
import { ComposePinIcon } from '@/util/svg/icon.compose';
import { useColorScheme } from 'nativewind';
import styles from './ComposeActionsBar.style';
import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import ManageAttachmentModal from '@/components/organisms/compose/modal/ManageAttachment/MakeAttachmentModal';
import {
	useManageAttachmentActions,
	useManageAttachmentStore,
} from '@/store/compose/manageAttachments/manageAttachmentStore';
import CallToActionModal from '@/components/organisms/compose/modal/CallToAction/CallToActionModal';
import {
	useCTAactions,
	useCallToActionStore,
} from '@/store/compose/callToAction/callToActionStore';
import {
	useVisibilitySettingsActions,
	useVisibilitySettingsStore,
} from '@/store/compose/visibilitySettings/visibilitySettingsStore';
import VisibilitySettingsModal from '@/components/organisms/compose/modal/VisibilitySettings/VisibilitySettingsModal';
import { cn } from '@/util/helper/twutil';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { POLL_INITIAL } from '@/util/constant/pollOption';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import {
	useLanguageSelectionActions,
	useLanguageSelectionStore,
} from '@/store/compose/languageSelection/languageSelection';
import LanguageSelectionModal from '@/components/organisms/compose/modal/LanguageSelection/LanguageSelectionModal';
import { useCallback, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DraftPost } from '@/util/svg/icon.common';
import {
	useDraftPostsActions,
	useDraftPostsStore,
} from '@/store/compose/draftPosts/draftPostsStore';
import DraftPostsModal from '@/components/organisms/compose/modal/DraftPosts/DraftPostsModal';
import { useAuthStore } from '@/store/auth/authStore';
import {
	CHANNEL_INSTANCE,
	DEFAULT_INSTANCE,
	MO_ME_INSTANCE,
	NEWSMAST_INSTANCE_V1,
} from '@/util/constant';
import ComposeActionButton from '@/components/atoms/compose/ComposeActionButton/ComposeActionButton';
import GifPickerModal from '@/components/molecules/compose/GifPickerModal/GifPickerModal';
import EmojiModal from '@/components/organisms/compose/modal/Emoji/EmojiModal';
import customColor from '@/util/constant/color';
import { useLanguageStore } from '@/store/feed/languageStore';
import { useTranslation } from 'react-i18next';
import WordCountIndicator from '@/components/atoms/compose/WordCountIndicator/WordCountIndicator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppIcons } from '@/util/icons/icon.common';

dayjs.extend(utc);

const ComposeActionsBar = ({
	composeType,
	comesFromNewSchedule = false,
}: {
	composeType: 'create' | 'repost' | 'edit' | 'schedule' | 'quote';
	comesFromNewSchedule?: boolean;
}) => {
	const { t } = useTranslation();
	const { composeState, composeDispatch } = useComposeStatus();
	const { colorScheme } = useColorScheme();
	const currentUTC = dayjs.utc();
	const minDateUTC = currentUTC.add(5, 'minute');
	const initialDate = useRef(minDateUTC.toDate());
	const { userOriginInstance } = useAuthStore();
	const { language } = useLanguageStore();

	const { mediaModal, selectedMedia, progress } = useManageAttachmentStore();
	const { onToggleMediaModal } = useManageAttachmentActions();
	const isMediaUploading = progress.currentIndex !== undefined;
	const [isDatePickerOpen, openDatePicker] = useState(false);
	const [showGifModal, setGifModal] = useState(false);
	const [isEmojiModalVisible, setEmojiModalVisible] = useState(false);

	const isMastodonScheduleActive =
		!!composeState.schedule?.schedule_detail_id &&
		userOriginInstance !== DEFAULT_INSTANCE;

	const isInEditMode = composeType === 'edit';

	useEffect(() => {
		if (composeState.schedule?.scheduled_at) {
			const previousDateFromComposeState = dayjs.utc(
				composeState.schedule.scheduled_at,
			);
			initialDate.current = previousDateFromComposeState.isAfter(minDateUTC)
				? previousDateFromComposeState.toDate()
				: minDateUTC.toDate();
			return;
		}
		initialDate.current = minDateUTC.toDate();
	}, [composeState.schedule]);

	useEffect(() => {
		if (composeType === 'schedule' && comesFromNewSchedule) {
			openDatePicker(true);
		}
	}, []);

	const onPressPoll = () => {
		if (composeState.poll) {
			composeDispatch({ type: 'poll', payload: null });
		} else {
			composeDispatch({
				type: 'poll',
				payload: POLL_INITIAL,
			});
		}
	};

	const onSelectSchedule = (d: Date) => {
		openDatePicker(false);
		composeDispatch({
			type: 'schedule',
			payload: {
				scheduled_at: d,
				schedule_detail_id: composeState.schedule?.schedule_detail_id || '',
				is_edting_previous_schedule:
					!!composeState.schedule?.is_edting_previous_schedule,
			},
		});
	};

	const visibilityModalVisible = useVisibilitySettingsStore(
		state => state.visibilityModalVisible,
	);
	const { onToggleVisibilityModal } = useVisibilitySettingsActions();

	const languageSelectionModalVisible = useLanguageSelectionStore(
		state => state.languageSelectionModalVisible,
	);
	const selectedLanguage = useLanguageSelectionStore(
		state => state.selectedLanguage,
	);
	const { onToggleLanguageSelectionModal } = useLanguageSelectionActions();

	const ctaModalVisible = useCallToActionStore(state => state.ctaModalVisible);
	const { onToggleCTAModal } = useCTAactions();

	const { onToggleDraftPostsModal } = useDraftPostsActions();
	const { isVisibleDraftPostsModal } = useDraftPostsStore();

	const getVisibilityIcon = () => {
		switch (composeState.visibility) {
			case 'public':
				return (
					<FontAwesomeIcon
						icon={AppIcons.globe}
						size={17}
						color={colorScheme == 'dark' ? '#fff' : '#000'}
					/>
				);
			case 'local':
				return <ComposePinIcon {...{ colorScheme }} />;
			case 'unlisted':
				return (
					<FontAwesomeIcon
						icon={AppIcons.unlock}
						size={17}
						color={colorScheme == 'dark' ? '#fff' : '#000'}
					/>
				);
			case 'private':
				return (
					<FontAwesomeIcon
						icon={AppIcons.lock}
						size={17}
						color={colorScheme == 'dark' ? '#fff' : '#000'}
					/>
				);
			case 'direct':
				return (
					<FontAwesomeIcon
						icon={AppIcons.mention}
						size={17}
						color={colorScheme == 'dark' ? '#fff' : '#000'}
					/>
				);
		}
	};

	const getLanguageIcon = () => {
		return (
			<View
				className={cn(
					'border  py-[1] px-1 rounded-md',
					colorScheme === 'dark' ? 'border-white' : 'border-patchwork-dark-100',
				)}
			>
				<ThemeText size={'xs_12'} className="font-NewsCycle_Bold">
					{selectedLanguage.toUpperCase()}
				</ThemeText>
			</View>
		);
	};

	const getGifIcon = () => {
		return (
			<View
				className={cn(
					'border  py-[1] px-[2] rounded-md',
					colorScheme === 'dark' ? 'border-white' : 'border-patchwork-dark-100',
				)}
			>
				<ThemeText size={'xs_12'} className="font-NewsCycle_Bold">
					GIF
				</ThemeText>
			</View>
		);
	};

	const onToggleSensitive = () => {
		composeDispatch({
			type: 'sensitive',
			payload: !composeState.sensitive,
		});
	};

	return (
		<View>
			<View className={styles.container}>
				<ComposeActionButton
					disabled={
						selectedMedia.length == 4 ||
						isMediaUploading ||
						!!composeState.poll ||
						composeType == 'quote' ||
						isMastodonScheduleActive
					}
					onPress={onToggleMediaModal}
					extraClassName={cn(
						'mr-3',
						(selectedMedia.length == 4 ||
							isMediaUploading ||
							!!composeState.poll ||
							composeType == 'quote' ||
							isMastodonScheduleActive) &&
							'opacity-30',
					)}
					icon={
						<FontAwesomeIcon
							icon={AppIcons.images}
							size={20}
							color={colorScheme == 'dark' ? '#fff' : '#000'}
						/>
					}
					helperText="Add Image"
				/>
				<ComposeActionButton
					disabled={
						selectedMedia.length == 4 ||
						isMediaUploading ||
						!!composeState.poll ||
						composeType == 'quote' ||
						isMastodonScheduleActive
					}
					onPress={() => setGifModal(showGifModal => !showGifModal)}
					extraClassName={cn(
						'mr-3',
						(selectedMedia.length == 4 ||
							isMediaUploading ||
							!!composeState.poll ||
							isMastodonScheduleActive) &&
							'opacity-30',
					)}
					icon={getGifIcon()}
					helperText="Add Gif"
				/>
				<ComposeActionButton
					disabled={composeType == 'repost' || isMastodonScheduleActive}
					extraClassName={cn(
						'mr-3 active:opacity-80',
						(composeType == 'repost' || isMastodonScheduleActive) &&
							'opacity-30',
					)}
					onPress={() =>
						setEmojiModalVisible(showEmojiModal => !showEmojiModal)
					}
					icon={
						<FontAwesomeIcon
							icon={AppIcons.emoji}
							size={20}
							color={colorScheme == 'dark' ? '#fff' : '#000'}
						/>
					}
					helperText="Add Emoji"
				/>
				<ComposeActionButton
					disabled={
						selectedMedia.length > 0 ||
						composeType == 'repost' ||
						isMastodonScheduleActive ||
						composeType == 'quote'
					}
					onPress={onPressPoll}
					extraClassName={cn(
						'mr-3',
						(selectedMedia.length > 0 ||
							composeType == 'repost' ||
							composeType == 'quote' ||
							isMastodonScheduleActive) &&
							'opacity-30',
					)}
					icon={
						<FontAwesomeIcon
							icon={AppIcons.poll}
							size={18}
							color={
								composeState.poll && colorScheme == 'dark'
									? customColor['patchwork-primary-dark']
									: composeState.poll && colorScheme == 'light'
									? customColor['patchwork-primary']
									: colorScheme == 'dark'
									? '#fff'
									: '#000'
							}
						/>
					}
					helperText="Add Poll"
				/>
				<ComposeActionButton
					disabled={false}
					extraClassName="mr-3"
					onPress={onToggleSensitive}
					icon={
						<FontAwesomeIcon
							icon={AppIcons.report}
							size={18}
							color={
								composeState.sensitive && colorScheme == 'dark'
									? customColor['patchwork-primary-dark']
									: composeState.sensitive && colorScheme == 'light'
									? customColor['patchwork-primary']
									: colorScheme == 'dark'
									? '#fff'
									: '#000'
							}
						/>
					}
					helperText="Content Warning"
				/>
				<View className="flex-1" />

				{(composeType == 'create' || composeType == 'schedule') && (
					<ComposeActionButton
						disabled={false}
						onPress={() => openDatePicker(true)}
						extraClassName={cn('mr-3 -mt-1')}
						icon={
							<FontAwesomeIcon
								icon={AppIcons.schedule}
								size={18}
								color={
									composeState.schedule && colorScheme == 'dark'
										? customColor['patchwork-primary-dark']
										: composeState.schedule && colorScheme == 'light'
										? customColor['patchwork-primary']
										: colorScheme == 'dark'
										? '#fff'
										: '#000'
								}
							/>
						}
						helperText="Setup date and time to schedule post"
					/>
				)}
				{[
					DEFAULT_INSTANCE,
					MO_ME_INSTANCE,
					NEWSMAST_INSTANCE_V1,
					CHANNEL_INSTANCE,
				].includes(userOriginInstance) && (
					<ComposeActionButton
						disabled={false}
						onPress={onToggleDraftPostsModal}
						extraClassName={'mr-3'}
						icon={<DraftPost {...{ colorScheme }} />}
						helperText="Drafts"
					/>
				)}
				<ComposeActionButton
					disabled={isMastodonScheduleActive}
					onPress={onToggleLanguageSelectionModal}
					extraClassName={cn('mr-3', isMastodonScheduleActive && 'opacity-30')}
					icon={getLanguageIcon()}
					helperText="Change Language"
				/>
				<ComposeActionButton
					disabled={isMastodonScheduleActive || isInEditMode}
					onPress={onToggleVisibilityModal}
					extraClassName={cn(
						'mr-3',
						(isMastodonScheduleActive || isInEditMode) && 'opacity-30',
					)}
					icon={getVisibilityIcon()}
					helperText="Change Visibility Settings"
				/>

				{composeType == 'quote' && (
					<View className="flex-1 my-3.5">
						<WordCountIndicator composeType={composeType} />
					</View>
				)}
			</View>

			<ThemeModal
				type="custom"
				position="bottom"
				visible={mediaModal}
				onClose={onToggleMediaModal}
				customModalContainterStyle={{
					bottom: 0,
					borderTopLeftRadius: 0,
					borderTopRightRadius: 0,
				}}
			>
				<ManageAttachmentModal {...{ onToggleMediaModal }} />
			</ThemeModal>

			{isEmojiModalVisible && (
				<EmojiModal
					isVisible={isEmojiModalVisible}
					onClose={() => setEmojiModalVisible(false)}
				/>
			)}

			<VisibilitySettingsModal
				visible={visibilityModalVisible}
				onClose={onToggleVisibilityModal}
			/>
			<LanguageSelectionModal
				openThemeModal={languageSelectionModalVisible}
				onCloseThemeModal={onToggleLanguageSelectionModal}
			/>
			<CallToActionModal visible={ctaModalVisible} onClose={onToggleCTAModal} />
			<GifPickerModal
				visibility={showGifModal}
				onClose={() => setGifModal(false)}
			/>
			<DatePicker
				modal
				mode="datetime"
				theme={colorScheme}
				title={t('compose.select_date')}
				locale={language}
				open={isDatePickerOpen}
				date={initialDate.current}
				minimumDate={minDateUTC.toDate()}
				onConfirm={onSelectSchedule}
				onCancel={() => {
					openDatePicker(false);
				}}
			/>
			<DraftPostsModal
				visible={isVisibleDraftPostsModal}
				onClose={onToggleDraftPostsModal}
			/>
		</View>
	);
};

export default ComposeActionsBar;
