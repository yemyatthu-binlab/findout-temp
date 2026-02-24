import { memo, useCallback, useState } from 'react';
import { View, Pressable } from 'react-native';
import { queryClient } from '@/App';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import ListDeleteModal from '@/components/atoms/lists/ListDeleteModal/ListDeleteModal';
import { useListsDeleteMutation } from '@/hooks/mutations/lists.mutation';
import { listsQueryKey } from '@/hooks/queries/lists.queries';
import { ListsStackScreenProps } from '@/types/navigation';
import {
	ChevronRightIcon,
	ListItemDeleteIcon,
	ListsIcon,
} from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';

const ListsItem = ({
	item,
	navigation,
}: {
	item: Patchwork.Lists;
	navigation: ListsStackScreenProps<'Lists'>['navigation'];
}) => {
	const { colorScheme } = useColorScheme();
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);

	const { mutate, isPending } = useListsDeleteMutation({
		onSuccess(_, { id }) {
			queryClient.setQueryData(
				listsQueryKey,
				(oldData: Patchwork.Lists[] | undefined) =>
					oldData?.filter(list => list.id !== id) || [],
			);
			setDeleteModalVisible(false);
		},
	});

	const handleDeleteList = useCallback(() => {
		if (!isPending) mutate({ id: item.id });
	}, [isPending, mutate, item.id]);

	return (
		<>
			<Pressable
				className="flex-row items-center justify-between mx-5 my-4"
				onPress={() =>
					navigation.navigate('ListTimelines', {
						id: item.id,
						title: item.title,
					})
				}
			>
				<View className="flex-row items-center">
					<ListsIcon {...{ colorScheme }} />
					<ThemeText className="ml-2">{item.title}</ThemeText>
				</View>
				<View className="flex-row items-center">
					<ChevronRightIcon width={12} height={12} {...{ colorScheme }} />
					<Pressable
						className="ml-1"
						onPress={() => setDeleteModalVisible(true)}
					>
						<ListItemDeleteIcon {...{ colorScheme }} />
					</Pressable>
				</View>
			</Pressable>
			{deleteModalVisible && (
				<ListDeleteModal
					openDeleteModal={deleteModalVisible}
					onPressHideDeleteModal={() => setDeleteModalVisible(false)}
					handleDeleteList={handleDeleteList}
					isPendingDeleteList={isPending}
				/>
			)}
		</>
	);
};

export default memo(ListsItem);
