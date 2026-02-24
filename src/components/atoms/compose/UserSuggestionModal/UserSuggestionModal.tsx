import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import useDebounce from '@/hooks/custom/useDebounce';
import { useSearchUsers } from '@/hooks/queries/conversations.queries';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import ThemeModal from '../../common/ThemeModal/ThemeModal';
import { FlatList } from 'react-native-gesture-handler';
import { getReplacedMentionText } from '@/util/helper/compose';
import { Flow } from 'react-native-animated-spinkit';
import customColor from '@/util/constant/color';
import Image from '../../common/Image/Image';
import Graphemer from 'graphemer';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

const splitter = new Graphemer();

const UserSuggestionModal = () => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const { composeState, composeDispatch } = useComposeStatus();
	const [debounceVal, setDebounceVal] = useState('');
	const startDebounce = useDebounce();
	const [openModal, setModal] = useState(false);
	const previousCurrentMentionStr = useRef('');
	const isSameMention =
		composeState?.currentMention?.raw === previousCurrentMentionStr.current;

	const {
		data: searchedUsers,
		isLoading,
		error,
	} = useSearchUsers({
		q: debounceVal,
		resolve: true,
		limit: 4,
		options: { enabled: debounceVal.length >= 2 },
	});

	useEffect(() => {
		if (
			(composeState.disableUserSuggestionsModal && isSameMention) ||
			(composeState?.schedule?.is_edting_previous_schedule &&
				composeState?.schedule?.forceCloseUserModalOnScheduleUpdate) ||
			composeState?.forceCloseUserModalOnDraft
		)
			return;

		if (composeState.currentMention?.raw?.length! >= 2) {
			startDebounce(() => {
				setModal(true);
				setDebounceVal(composeState.currentMention?.raw || '');
			}, 800);
		}
	}, [composeState.currentMention?.raw]);
	return (
		<ThemeModal
			type="simple"
			position="bottom"
			visible={openModal}
			onClose={() => {
				setModal(false);
			}}
		>
			<View className="h-[300]">
				{searchedUsers?.data ? (
					<FlatList
						data={searchedUsers.data}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={() => {
							return (
								<ThemeText variant="textPrimary" className="text-center">
									* {t('conversation.no_user_found')}
								</ThemeText>
							);
						}}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => {
									setModal(false);
									const newString = getReplacedMentionText(
										composeState.text.raw,
										composeState.currentMention?.index ?? 0,
										item.acct,
									);
									previousCurrentMentionStr.current = '@' + item.acct;

									composeDispatch({
										type: 'replaceMentionText',
										payload: {
											raw: newString,
											count: splitter.countGraphemes(newString),
										},
									});

									composeDispatch({
										type: 'disableUserSuggestionsModal',
										payload: true,
									});
								}}
							>
								<View className="p-4 flex-row">
									<Image
										uri={item.avatar_static}
										className="w-10 h-10 rounded-full mr-3"
									/>
									<View>
										<ThemeText
											emojis={item.emojis}
											className="text-patchwork-dark-100 dark:text-white"
										>
											{item.display_name || item.username}
										</ThemeText>
										<ThemeText className="text-patchwork-dark-100 dark:text-white">
											@{item.username}
										</ThemeText>
									</View>
								</View>
							</TouchableOpacity>
						)}
						keyExtractor={item => item.id.toString()}
						showsHorizontalScrollIndicator={false}
					/>
				) : (
					!searchedUsers &&
					!isLoading && (
						<ThemeText variant="textPrimary" className="text-center">
							* {t('conversation.no_user_found')}
						</ThemeText>
					)
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

export default UserSuggestionModal;
