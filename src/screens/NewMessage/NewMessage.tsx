import { View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import Header from '@/components/atoms/common/Header/Header';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import {
	BottomBarHeight,
	useGradualAnimation,
} from '@/hooks/custom/useGradualAnimation';
import { ComposeStatusProvider } from '@/context/composeStatusContext/composeStatus.context';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { SearchIcon } from '@/util/svg/icon.common';
import useDebounce from '@/hooks/custom/useDebounce';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Flow } from 'react-native-animated-spinkit';
import customColor from '@/util/constant/color';
import { useSearchUsers } from '@/hooks/queries/conversations.queries';
import { ConversationsStackScreenProps } from '@/types/navigation';
import { useAuthStore } from '@/store/auth/authStore';
import NewMsgUserItem from '@/components/atoms/conversations/NewMsgUserItem/NewMsgUserItem';
import { useFollowingAccountsQuery } from '@/hooks/queries/profile.queries';
import { flattenPages } from '@/util/helper/timeline';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

const NewMessage = ({
	navigation,
}: ConversationsStackScreenProps<'NewMessage'>) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const [finalKeyword, setFinalKeyword] = useState('');
	const [searchKeyword, setSearchKeyword] = useState('');
	const startDebounce = useDebounce();
	const { height } = useGradualAnimation();
	const { userInfo } = useAuthStore();

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
		limit: 5,
		options: { enabled: finalKeyword.length > 1 },
	});

	const { data: followedAccounts } = useFollowingAccountsQuery({
		accountId: userInfo?.id!,
		domain_name: process.env.API_URL!,
	});

	const followedAccountList = flattenPages(followedAccounts).slice(0, 10);

	useEffect(() => {
		startDebounce(() => {
			setFinalKeyword(searchKeyword);
		}, 800);
	}, [searchKeyword]);

	return (
		<SafeScreen>
			<ComposeStatusProvider type="chat">
				<View style={{ flex: 1 }}>
					<Header
						title={t('screen.new_message')}
						leftCustomComponent={<BackButton />}
					/>
					<View className="mx-3">
						<TextInput
							placeholder={t('conversation.search_by_name_or_username')}
							extraContainerStyle="h-11"
							startIcon={<SearchIcon />}
							onChangeText={str => {
								setSearchKeyword(str);
							}}
							value={searchKeyword}
							autoCapitalize="none"
							autoCorrect={false}
							spellCheck={false}
							autoComplete="off"
						/>
					</View>
					<FlatList
						data={
							finalKeyword.length > 1
								? searchedUsers?.data || []
								: followedAccountList || []
						}
						showsVerticalScrollIndicator={false}
						renderItem={({ item }) => <NewMsgUserItem item={item} />}
						keyExtractor={item => item.id.toString()}
						showsHorizontalScrollIndicator={false}
						ListEmptyComponent={() => {
							if (finalKeyword.length > 1) {
								if (isLoading) {
									return (
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
									);
								} else {
									return (
										<ThemeText
											variant="textPrimary"
											className="text-center mt-4"
										>
											* {t('conversation.no_user_found')}
										</ThemeText>
									);
								}
							}
							return <></>;
						}}
					/>
					<Animated.View style={virtualKeyboardContainerStyle} />
				</View>
			</ComposeStatusProvider>
		</SafeScreen>
	);
};

export default NewMessage;
