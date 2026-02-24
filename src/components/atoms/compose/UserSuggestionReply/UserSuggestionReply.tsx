import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import useDebounce from '@/hooks/custom/useDebounce';
import { useSearchUsers } from '@/hooks/queries/conversations.queries';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { FlatList } from 'react-native-gesture-handler';
import { getReplacedMentionText } from '@/util/helper/compose';
import UserSuggestionLoading from '../../loading/UserSuggestionLoading';
import Image from '../../common/Image/Image';
import Graphemer from 'graphemer';

const splitter = new Graphemer();

const UserSuggestionReply = () => {
	const { composeState, composeDispatch } = useComposeStatus();
	const [debounceVal, setDebounceVal] = useState('');
	const startDebounce = useDebounce();
	const [showUserSuggestion, setUserSuggView] = useState(false);
	const previousCurrentMentionStr = useRef('');

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
		if (composeState.disableUserSuggestionsModal) {
			previousCurrentMentionStr.current = '';
			setDebounceVal('');
			return;
		}
		if (composeState.currentMention?.raw?.length! >= 2) {
			startDebounce(() => {
				setUserSuggView(true);
				setDebounceVal(composeState.currentMention?.raw || '');
			}, 1200);
		}
	}, [
		composeState.currentMention?.raw,
		composeState.disableUserSuggestionsModal,
	]);
	if (!showUserSuggestion || composeState.disableUserSuggestionsModal)
		return <></>;
	return (
		<View>
			{searchedUsers?.data && (
				<FlatList
					data={searchedUsers.data}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps={'always'}
					horizontal
					renderItem={({ item }) => (
						<Pressable
							onPress={() => {
								setUserSuggView(false);
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
							className="active:opacity-80"
						>
							<View className="pr-5 py-2 flex-row items-center">
								<Image
									uri={item.avatar}
									className="w-8 h-8 rounded-full mr-3"
								/>
								<View>
									<ThemeText emojis={item.emojis} className="text-white">
										{item.display_name || item.username}
									</ThemeText>
									<ThemeText className="text-white">@{item.username}</ThemeText>
								</View>
							</View>
						</Pressable>
					)}
					keyExtractor={item => item.id.toString()}
					showsHorizontalScrollIndicator={false}
				/>
			)}
			{isLoading && <UserSuggestionLoading />}
		</View>
	);
};

export default UserSuggestionReply;
