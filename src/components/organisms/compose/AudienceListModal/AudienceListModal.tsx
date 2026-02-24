import Checkbox from '@/components/atoms/common/Checkbox/Checkbox';
import Image from '@/components/atoms/common/Image/Image';
import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import {
	useFavouriteChannelLists,
	useGetForYouChannelList,
} from '@/hooks/queries/channel.queries';
import { useCreateAudienceStore } from '@/store/compose/audienceStore/createAudienceStore';
import { useEditAudienceStore } from '@/store/compose/audienceStore/editAudienceStore';
import { useDraftPostsStore } from '@/store/compose/draftPosts/draftPostsStore';
import customColor from '@/util/constant/color';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useColorScheme } from 'nativewind';

const screenHeight = Dimensions.get('window').height;
const modalHeight = screenHeight * 0.6;

type Props = {
	composeType: 'create' | 'edit' | 'repost' | 'quote' | 'schedule';
	onClose: () => void;
};

export const AudienceListModal = ({ composeType, onClose }: Props) => {
	const { composeState } = useComposeStatus();
	const { colorScheme } = useColorScheme();
	const { selectedAudience, setSelectedAudience, toggleAudience } =
		useCreateAudienceStore();
	const { editSelectedAudience, setEditSelectedAudience, toggleEditAudience } =
		useEditAudienceStore();
	const { selectedDraftId } = useDraftPostsStore();

	const isSchedule = !!composeState.schedule?.is_edting_previous_schedule;
	const isDraft = composeType === 'create' && !!selectedDraftId;

	const audienceSource =
		isSchedule || isDraft || composeType === 'edit'
			? editSelectedAudience
			: selectedAudience;

	const setAudience =
		isSchedule || isDraft || composeType === 'edit'
			? setEditSelectedAudience
			: setSelectedAudience;

	const { data: newsmastChannels, isLoading } = useGetForYouChannelList();

	const onPressCheckbox = (item: Patchwork.ChannelList) => {
		if (isDraft || isSchedule || composeType === 'edit') {
			toggleEditAudience(item.attributes);
		} else {
			toggleAudience(item.attributes);
		}
	};

	const handleSelectAll = () => {
		const newAudience = newsmastChannels?.map(item => item.attributes) ?? [];
		setAudience(newAudience);
	};

	const handleUnselectAll = () => {
		setAudience([]);
	};

	return (
		<ThemeModal
			type="simple"
			title="Choose audience"
			position="bottom"
			visible={true}
			onClose={onClose}
		>
			<View style={{ height: modalHeight }}>
				<Pressable
					className="self-start px-3 py-1 border border-patchwork-grey-400 rounded-full my-2 mr-3 active:opacity-75"
					onPress={() => {
						if (audienceSource.length === newsmastChannels?.length) {
							handleUnselectAll();
						} else {
							handleSelectAll();
						}
					}}
				>
					<ThemeText>
						{audienceSource.length === newsmastChannels?.length
							? 'Unselect all'
							: 'Select all'}
					</ThemeText>
				</Pressable>
				{newsmastChannels && (
					<FlatList
						data={newsmastChannels}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={() => {
							return (
								<ThemeText variant="textPrimary" className="text-center">
									There is no community available.
								</ThemeText>
							);
						}}
						renderItem={({ item }) => {
							const isChecked = audienceSource.some(
								sel => sel.id === item.attributes?.id,
							);

							return (
								<Checkbox
									isChecked={isChecked}
									handleOnCheck={() => onPressCheckbox(item)}
								>
									<View className="flex-row items-center px-3 py-3 space-x-3">
										<Image
											uri={item.attributes?.avatar_image_url}
											className="w-10 h-10 rounded-full"
										/>
										<ThemeText>{item.attributes?.name}</ThemeText>
									</View>
								</Checkbox>
							);
						}}
						keyExtractor={item => item.id.toString()}
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
