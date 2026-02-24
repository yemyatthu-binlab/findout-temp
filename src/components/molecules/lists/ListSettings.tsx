import { useState } from 'react';
import { Pressable, View } from 'react-native';
import {
	Menu,
	MenuOption,
	MenuOptions,
	MenuTrigger,
} from 'react-native-popup-menu';
import customColor from '@/util/constant/color';
import { ListMembersIcon, SettingIcon } from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';
import MenuOptionIcon from '@/components/atoms/feed/StatusMenu/MenuOptionIcon/MenuOptionIcon';
import {
	StatusDeleteIcon,
	StatusEditIcon,
} from '@/util/svg/icon.status_actions';
import { ListTimelinesScreenNavigationProp } from '@/types/navigation';
import ListDeleteModal from '@/components/atoms/lists/ListDeleteModal/ListDeleteModal';
import { useListsDeleteMutation } from '@/hooks/mutations/lists.mutation';
import { queryClient } from '@/App';
import { listsQueryKey } from '@/hooks/queries/lists.queries';
import { useTranslation } from 'react-i18next';

const ListSettings = ({
	navigation,
	id,
	title,
}: {
	navigation: ListTimelinesScreenNavigationProp;
	id: string;
	title: string;
}) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();

	const [menuVisible, setMenuVisible] = useState(false);
	const hideMenu = () => setMenuVisible(false);
	const showMenu = () => setMenuVisible(true);

	const [deleteModalVisible, setDeleteModalVisible] = useState(false);

	const onPressShowDeleteModal = () => {
		setDeleteModalVisible(prevState => !prevState);
		hideMenu();
	};

	const { mutate, isPending } = useListsDeleteMutation({
		onSuccess(_, { id }) {
			queryClient.setQueryData(
				listsQueryKey,
				(oldData: Patchwork.Lists[] | undefined) => {
					if (!oldData) return [];
					return oldData.filter(list => list.id !== id);
				},
			);

			navigation.goBack();
			setDeleteModalVisible(false);
		},
	});

	const handleDeleteList = () => !isPending && mutate({ id });

	return (
		<View>
			<Menu
				opened={menuVisible}
				style={{ zIndex: 1000 }}
				onBackdropPress={hideMenu}
			>
				<MenuTrigger>
					<Pressable
						onPress={showMenu}
						className="p-3 border border-slate-200 rounded-full active:opacity-80"
					>
						<SettingIcon colorScheme={colorScheme} />
					</Pressable>
				</MenuTrigger>
				<MenuOptions
					customStyles={{
						optionsContainer: {
							backgroundColor:
								colorScheme === 'dark'
									? customColor['patchwork-dark-50']
									: '#fff',
							borderRadius: 8,
						},
					}}
				>
					<>
						<MenuOption
							onSelect={() => {
								navigation.navigate('UpsertList', { type: 'edit', id });
								hideMenu();
							}}
						>
							<MenuOptionIcon
								icon={<StatusEditIcon {...{ colorScheme }} />}
								name={t('timeline.edit_list_info')}
							/>
						</MenuOption>
						<MenuOption
							onSelect={() => {
								navigation.navigate('ManageListMembers', {
									listId: id,
									listTimelinesTitle: title,
									isEditMember: true,
								});
								hideMenu();
							}}
						>
							<MenuOptionIcon
								icon={<ListMembersIcon {...{ colorScheme }} />}
								name={t('timeline.edit_list_members')}
							/>
						</MenuOption>
						<MenuOption onSelect={onPressShowDeleteModal}>
							<MenuOptionIcon
								icon={<StatusDeleteIcon {...{ colorScheme }} />}
								name={t('timeline.delete_list')}
							/>
						</MenuOption>
					</>
				</MenuOptions>
			</Menu>

			{deleteModalVisible && (
				<ListDeleteModal
					openDeleteModal={deleteModalVisible}
					onPressHideDeleteModal={() => setDeleteModalVisible(false)}
					handleDeleteList={handleDeleteList}
					isPendingDeleteList={isPending}
				/>
			)}
		</View>
	);
};

export default ListSettings;
