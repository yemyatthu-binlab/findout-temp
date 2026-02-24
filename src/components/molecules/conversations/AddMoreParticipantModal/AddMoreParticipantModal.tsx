import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import customColor from '@/util/constant/color';
import {
	PollRadioCheckedIcon,
	PollRadioOutlined,
	SearchIcon,
} from '@/util/svg/icon.common';
import { VerifyIcon } from '@/util/svg/icon.conversations';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useDebounce from '@/hooks/custom/useDebounce';
import { useSearchUsers } from '@/hooks/queries/conversations.queries';
import { Flow } from 'react-native-animated-spinkit';
import {
	checkIsAccountVerified,
	isAccAlreadySelected,
	truncateStr,
} from '@/util/helper/helper';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import {
	BottomBarHeight,
	useGradualAnimation,
} from '@/hooks/custom/useGradualAnimation';
import CustomAlert from '@/components/atoms/common/CustomAlert/CustomAlert';
import { useAuthStore } from '@/store/auth/authStore';
import Image from '@/components/atoms/common/Image/Image';
import { useTranslation } from 'react-i18next';

type Props = {
	onCloseThemeModal: () => void;
	previousSelectedUserList: Patchwork.Account[];
	onAddNewParticipant: (recepent: Patchwork.Account) => void;
	onRemovePreviousParticipant: (participant: Patchwork.Account) => void;
};
const AddMoreParticipantModal = ({
	onCloseThemeModal,
	previousSelectedUserList,
	onAddNewParticipant,
	onRemovePreviousParticipant,
}: Props) => {
	const { t } = useTranslation();
	const screenHeight = Dimensions.get('window').height;
	const { top } = useSafeAreaInsets();
	const modalHeight = screenHeight - (top + 85);
	const [finalKeyword, setFinalKeyword] = useState('');
	const [searchKeyword, setSearchKeyword] = useState('');
	const startDebounce = useDebounce();
	const { height } = useGradualAnimation();
	const { colorScheme } = useColorScheme();
	const { userInfo } = useAuthStore();

	const [currentSelectedUsers, setCurrentSelectedUsers] = useState<
		Patchwork.Account[]
	>([]);

	const [currentActiveListViewType, setCurrentActiveListViewType] = useState<
		'previous-selected-users' | 'current-searching-users'
	>('current-searching-users');

	const [alertState, setAlert] = useState({
		message: '',
		isOpen: false,
		isFirstOne: false,
	});

	const virtualKeyboardContainerStyle = useAnimatedStyle(() => {
		return {
			height:
				height.value > BottomBarHeight ? height.value - BottomBarHeight : 0,
		};
	});

	const {
		data: searchedUsers,
		isLoading,
		error,
	} = useSearchUsers({
		q: finalKeyword,
		resolve: true,
		limit: 15,
		options: { enabled: finalKeyword.length > 1 },
	});

	useEffect(() => {
		startDebounce(() => {
			setFinalKeyword(searchKeyword);
		}, 800);
	}, [searchKeyword]);

	const renderUser = (user: Patchwork.Account) => {
		if (user.acct == userInfo?.acct && user.id == userInfo.id) {
			return <></>;
		}
		const isSelected = currentSelectedUsers.some(u => u.id === user.id);
		return (
			<Pressable
				className="py-4 px-5 flex-row active:opacity-90 justify-between"
				onPress={() => {
					if (isAccAlreadySelected(previousSelectedUserList, user)) return;

					if (isSelected) {
						setCurrentSelectedUsers(prev => prev.filter(u => u.id !== user.id));
					} else {
						setCurrentSelectedUsers(prev => [...prev, user]);
					}
				}}
			>
				<View className="flex-row">
					<Image
						className="w-10 h-10 rounded-full mr-3 border-patchwork-grey-50 border"
						uri={user.avatar}
					/>
					<View>
						<View className="flex-row items-center justify-between">
							<View className="flex-row items-center">
								<ThemeText emojis={user.emojis} className="dark:text-white">
									{truncateStr(user.display_name || user.username, 30)}
								</ThemeText>
								{checkIsAccountVerified(user.fields) && (
									<VerifyIcon
										className="ml-2"
										width={13}
										height={13}
										colorScheme={colorScheme}
									/>
								)}
							</View>
						</View>
						<ThemeText className="text-patchwork-dark-100 dark:text-white">
							@{truncateStr(user.username, 30)}
						</ThemeText>
					</View>
				</View>
				{isAccAlreadySelected(previousSelectedUserList, user) ? (
					<Pressable
						onPress={() => {
							if (user.id == previousSelectedUserList[0].id) {
								return setAlert({
									isFirstOne: true,
									isOpen: true,
									message: t('conversation.the_first_user_cannot_be_removed.'),
								});
							}

							onRemovePreviousParticipant(user);
						}}
						className="active:opacity-90"
					>
						<ThemeText size="xs_12" variant="textRedUnderline">
							{t('common.remove')}
						</ThemeText>
					</Pressable>
				) : isSelected ? (
					<PollRadioCheckedIcon width={17} height={17} className="ml-2" />
				) : (
					<PollRadioOutlined width={17} height={17} className="ml-2" />
				)}
				{alertState.isOpen && (
					<CustomAlert
						isVisible={true}
						hasCancel={!alertState.isFirstOne}
						extraTitleStyle="text-white text-center -ml-2"
						extraOkBtnStyle={
							colorScheme == 'dark' ? 'text-white' : 'text-black'
						}
						message={alertState.message}
						title={alertState.isFirstOne ? '' : t('common.delete')}
						handleCancel={() =>
							setAlert(prev => ({
								...prev,
								isOpen: false,
							}))
						}
						handleOk={() => {
							setAlert(prev => ({
								...prev,
								isOpen: false,
							}));
							!alertState.isFirstOne && onRemovePreviousParticipant(user);
						}}
						type="error"
					/>
				)}
			</Pressable>
		);
	};

	return (
		<ThemeModal
			visible={true}
			onClose={onCloseThemeModal}
			type="alternative"
			position="bottom"
			hasNotch
			modalHeight={modalHeight}
			confirm={{
				text: t('common.save'),
				onPress: () => {
					currentSelectedUsers.forEach(user => {
						onAddNewParticipant(user);
					});
					onCloseThemeModal();
				},
			}}
		>
			<View style={{ flex: 1 }}>
				<View className="mt-3">
					<TextInput
						placeholder={t('conversation.search_by_name_or_username')}
						extraContainerStyle="h-11"
						startIcon={<SearchIcon />}
						onChangeText={str => setSearchKeyword(str)}
						value={searchKeyword}
						autoCapitalize="none"
						autoComplete="off"
						autoCorrect={false}
					/>
				</View>
				<FlatList
					data={
						currentActiveListViewType == 'current-searching-users'
							? searchedUsers?.data
							: previousSelectedUserList
					}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => renderUser(item)}
					ListHeaderComponent={() => {
						return (
							<View className="mt-2 flex-row justify-between items-center">
								<ThemeText className="font-NewsCycle_Bold">
									{currentActiveListViewType == 'current-searching-users'
										? `${t('conversation.search_results')} :`
										: `${t('conversation.selected_users')} :`}
								</ThemeText>
								<Pressable
									onPress={() => {
										setCurrentActiveListViewType(prev =>
											prev == 'previous-selected-users'
												? 'current-searching-users'
												: 'previous-selected-users',
										);
									}}
									className="active:opacity-90"
								>
									<ThemeText
										size={'xs_12'}
										className="mt-2 dark:text-slate-400"
									>
										{currentActiveListViewType == 'current-searching-users'
											? `${t('conversation.selected_users')} >>`
											: `${t('conversation.searched_results')} >>`}
									</ThemeText>
								</Pressable>
							</View>
						);
					}}
					keyExtractor={item => item?.id?.toString()}
					showsHorizontalScrollIndicator={false}
					ListEmptyComponent={() => {
						return (
							<View>
								{finalKeyword.length > 0 && !isLoading && (
									<ThemeText variant="textPrimary" className="text-center mt-4">
										* {t('conversation.no_user_found')}
									</ThemeText>
								)}
								{finalKeyword.length > 0 && isLoading && (
									<View className="flex-1 items-center justify-center mt-10">
										<Flow
											size={25}
											color={
												colorScheme === 'dark'
													? customColor['patchwork-primary-dark']
													: customColor['patchwork-primary']
											}
										/>
									</View>
								)}
							</View>
						);
					}}
				/>
				<Animated.View style={virtualKeyboardContainerStyle} />
			</View>
		</ThemeModal>
	);
};

export default AddMoreParticipantModal;
