import React from 'react';
import { View, Pressable } from 'react-native';
import {
	ComposeGlobeIcon,
	ComposeLinkIcon,
	ComposeGalleryIcon,
	ComposeGifIcon,
	ComposeLocationIcon,
	ComposePlusIcon,
	ComposePollIcon,
	ComposePinIcon,
	ComposeUnlockIcon,
	ComposeLockIcon,
	ComposeMentionIcon,
} from '@/util/svg/icon.compose';
import { useColorScheme } from 'nativewind';
import styles from './ConversationsActionsBar.style';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
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
import { useMaxCount } from '@/hooks/custom/useMaxCount';
import { useTranslation } from 'react-i18next';

const ConversationsActionsBar = () => {
	const { t } = useTranslation();
	const { composeState, composeDispatch } = useComposeStatus();
	const { colorScheme } = useColorScheme();
	const maxStatusLength = useMaxCount();

	// ****** Media Store ****** //
	const { mediaModal, selectedMedia, progress } = useManageAttachmentStore();
	const { onToggleMediaModal } = useManageAttachmentActions();
	const isMediaUploading = progress.currentIndex !== undefined;
	// ****** Media Store ****** //

	// ****** Poll Store ****** //
	// const [isPollModalVisible, setPollModalVisible] = useState(false);
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
	// ****** Poll Store ****** //

	// ****** Visibility Store ****** //
	const visibilityModalVisible = useVisibilitySettingsStore(
		state => state.visibilityModalVisible,
	);
	const { onToggleVisibilityModal } = useVisibilitySettingsActions();
	// ****** Visibility Store ****** //

	// ****** CTA Store ****** //
	const ctaModalVisible = useCallToActionStore(state => state.ctaModalVisible);
	const { onToggleCTAModal } = useCTAactions();
	// ****** CTA Store ****** //

	const getVisibilityIcon = () => {
		switch (composeState.visibility) {
			case 'public':
				return <ComposeGlobeIcon {...{ colorScheme }} stroke={'#6D7276'} />;
			case 'local':
				return <ComposePinIcon {...{ colorScheme }} stroke={'#6D7276'} />;
			case 'unlisted':
				return <ComposeUnlockIcon {...{ colorScheme }} stroke={'#6D7276'} />;
			case 'private':
				return <ComposeLockIcon {...{ colorScheme }} stroke={'#6D7276'} />;
			case 'direct':
				return <ComposeMentionIcon {...{ colorScheme }} stroke={'#6D7276'} />;
		}
	};

	return (
		<View>
			<View className={styles.container}>
				{/****** Media Upload Action ******/}
				<Pressable
					disabled
					onPress={onToggleMediaModal}
					className={cn(
						'mr-3',
						(selectedMedia.length == 4 || isMediaUploading) && 'opacity-40',
					)}
					children={
						<ComposeGalleryIcon {...{ colorScheme }} stroke={'#6D7276'} />
					}
				/>
				{/****** Media Upload Action ******/}

				<Pressable
					disabled
					className={'mr-3'}
					children={<ComposeGifIcon {...{ colorScheme }} stroke={'#6D7276'} />}
				/>
				<Pressable
					disabled
					className={'mr-3'}
					children={
						<ComposeLocationIcon {...{ colorScheme }} stroke={'#6D7276'} />
					}
				/>

				{/****** Poll Action ******/}
				<Pressable
					disabled
					onPress={onPressPoll}
					className={cn('mr-3', selectedMedia.length > 0 && 'opacity-40')}
					children={
						<ComposePollIcon
							{...{ colorScheme }}
							// stroke={composeState.poll ? '#FF3C26' : '#FFFFFF'}
							stroke={'#6D7276'}
						/>
					}
				/>
				{/****** Poll Action ******/}

				{/****** Visibility Settings Action ******/}
				{/* <Pressable
					disabled
					onPress={onToggleVisibilityModal}
					className={'mr-3'}
					children={getVisibilityIcon}
				/> */}
				{/****** Visibility Settings Action ******/}

				{/****** CTA Action ******/}
				<Pressable
					disabled={true}
					onPress={onToggleCTAModal}
					className={'mr-3'}
					children={<ComposeLinkIcon {...{ colorScheme }} fill={'#6D7276'} />}
				/>
				{/****** CTA Action ******/}

				{/****** Long Post Action ******/}
				{composeState?.maxCount === 500 ? (
					<View className="flex-1 items-end">
						<View className="flex-row items-center">
							<ThemeText className="mr-3 text-white">
								{composeState.text.count ? 500 - composeState.text.count : 500}
							</ThemeText>
							<Pressable
								className="flex-row items-center"
								onPress={() =>
									composeDispatch({
										type: 'maxCount',
										payload: maxStatusLength,
									})
								}
							>
								<ComposePlusIcon />
								<ThemeText className="ml-2 text-white">
									{t('long_post')}
								</ThemeText>
							</Pressable>
						</View>
					</View>
				) : (
					<View className="flex-1 items-end">
						<Pressable
							className="flex-row items-center"
							onPress={() =>
								composeDispatch({
									type: 'maxCount',
									payload: 500,
								})
							}
						>
							<ThemeText className="ml-2 text-white">
								{composeState.text.count
									? maxStatusLength - composeState.text.count
									: maxStatusLength}
							</ThemeText>
						</Pressable>
					</View>
				)}

				{/****** Long Post Action ******/}
			</View>

			{/****** Manage Attachments ( Photos and Videos ) Modal ******/}
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
				<ManageAttachmentModal {...{ onToggleMediaModal }} hideVideoUpload />
			</ThemeModal>
			{/****** Manage Attachments ( Photos and Videos ) Modal ******/}

			{/****** Poll Modal ******/}
			{/* <PollModal
				visible={isPollModalVisible}
				onClose={() => setPollModalVisible(false)}
			/> */}
			{/****** Poll Modal ******/}

			{/****** Visibility Settings Modal ******/}
			<VisibilitySettingsModal
				visible={visibilityModalVisible}
				onClose={onToggleVisibilityModal}
			/>
			{/****** Visibility Settings Modal ******/}

			{/****** CTA Modal ******/}
			<CallToActionModal visible={ctaModalVisible} onClose={onToggleCTAModal} />
			{/****** CTA Modal ******/}
		</View>
	);
};

export default ConversationsActionsBar;
