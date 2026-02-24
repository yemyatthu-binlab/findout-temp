import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useAuthStore } from '@/store/auth/authStore';
import { useCreateAudienceStore } from '@/store/compose/audienceStore/createAudienceStore';
import { useEditAudienceStore } from '@/store/compose/audienceStore/editAudienceStore';
import { useDraftPostsStore } from '@/store/compose/draftPosts/draftPostsStore';
import { CHANNEL_INSTANCE, DEFAULT_INSTANCE } from '@/util/constant';
import { PollDropperIcon } from '@/util/svg/icon.compose';
import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';

type Props = {
	composeType: 'create' | 'edit' | 'repost' | 'schedule' | 'quote';
	onPress: () => void;
};

export const SelectAudienceBtn = ({ composeType, onPress }: Props) => {
	const { composeState } = useComposeStatus();
	const { userOriginInstance } = useAuthStore();
	const { selectedAudience } = useCreateAudienceStore();
	const { editSelectedAudience } = useEditAudienceStore();
	const { selectedDraftId } = useDraftPostsStore();
	const isSchedule = !!composeState.schedule?.is_edting_previous_schedule;
	const isDraft = !!selectedDraftId;
	const { colorScheme } = useColorScheme();

	const audienceSource =
		isDraft || isSchedule || composeType === 'edit'
			? editSelectedAudience
			: selectedAudience;

	const isMastodonScheduleActive =
		!!composeState.schedule?.schedule_detail_id &&
		userOriginInstance !== DEFAULT_INSTANCE;

	return (
		<Pressable
			className={`max-w-[65%] self-start flex-row items-center px-3 py-1 mx-4 my-1 border rounded-full ${
				isMastodonScheduleActive
					? 'border-patchwork-grey-70 opacity-40'
					: 'border-patchwork-grey-400 active:opacity-75'
			}`}
			onPress={onPress}
			disabled={isMastodonScheduleActive}
		>
			<ThemeText className="w-auto">
				{audienceSource && audienceSource.length > 0
					? `${audienceSource[0].name}${
							audienceSource.length > 1
								? ` +${audienceSource.length - 1} more`
								: ''
					  }`
					: 'Show name'}
			</ThemeText>
			<PollDropperIcon className="mt-0.5 ml-1" {...{ colorScheme }} />
		</Pressable>
	);
};
