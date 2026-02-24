import { View, FlatList, Pressable } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import Underline from '@/components/atoms/common/Underline/Underline';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import customColor from '@/util/constant/color';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useNavigation } from '@react-navigation/native';
import { SettingStackScreenProps } from '@/types/navigation';
import {
	useGetMutedContributorList,
	useGetMyTotalChannelList,
} from '@/hooks/queries/channel.queries';
import Image from '@/components/atoms/common/Image/Image';
import CustomAlert from '@/components/atoms/common/CustomAlert/CustomAlert';
import { useState } from 'react';
import { useMuteUnmuteUserMutation } from '@/hooks/queries/feed.queries';
import { updateMutedContributorListInForm } from '@/util/cache/channel/channelCache';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

const AllMutedContributorList = () => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const navigation =
		useNavigation<
			SettingStackScreenProps<'AllMutedContributorList'>['navigation']
		>();

	const [alertState, setAlert] = useState({
		message: '',
		isOpen: false,
		selectedId: '',
		isMuted: false,
	});

	const { data: myChannels } = useGetMyTotalChannelList();
	const channelId = myChannels?.[0]?.id || '';

	const { data: contributors, isLoading: isLoadingContributorList } =
		useGetMutedContributorList(channelId, false);

	const { mutate: toggleMute, isPending: isMuteInProgress } =
		useMuteUnmuteUserMutation({
			onMutate: ({ accountId }) => {
				updateMutedContributorListInForm(channelId, accountId);
			},
		});

	const handleMute = (id: string, isMuted: boolean) => {
		toggleMute({ accountId: id, toMute: !isMuted });
	};

	return (
		<SafeScreen>
			<Header
				title={t('screen.muted_contributors')}
				leftCustomComponent={<BackButton />}
				underlineClassName="mb-0"
			/>

			{isLoadingContributorList ? (
				<View className="flex-1 justify-center items-center">
					<Flow
						size={50}
						color={
							colorScheme === 'dark'
								? customColor['patchwork-primary-dark']
								: customColor['patchwork-primary']
						}
					/>
				</View>
			) : (
				<FlatList
					data={contributors}
					keyExtractor={item => item.attributes?.id}
					renderItem={({ item }) => (
						<View className="flex-row justify-between items-center px-5">
							<Pressable
								onPress={() =>
									navigation.navigate('ProfileOther', {
										id: item.attributes?.id,
									})
								}
								className="flex-1 flex-row items-center my-3"
							>
								<View className="bg-black p-[2] border border-slate-200 rounded-full mr-3">
									<Image
										uri={item?.attributes.avatar_url}
										className="w-14 h-14 rounded-full"
									/>
								</View>
								<View>
									<ThemeText
										ellipsizeMode="tail"
										numberOfLines={1}
										className="font-NewsCycle_Bold"
									>
										{item.attributes.display_name || item.attributes.username}
									</ThemeText>
									<ThemeText variant="textGrey" size="fs_13">
										@{item.attributes.username}
									</ThemeText>
								</View>
							</Pressable>
							<Pressable
								onPress={() => {
									setAlert({
										isOpen: true,
										message: `Are you sure you want to remove this contributor '${item.attributes.username}'?`,
										selectedId: item.attributes.id,
										isMuted: item.attributes.is_muted,
									});
								}}
								className="active:opacity-80 px-3"
								hitSlop={10}
							>
								<ThemeText variant={'textOrange'}>
									{t('common.remove')}
								</ThemeText>
							</Pressable>
						</View>
					)}
					ItemSeparatorComponent={Underline}
					showsVerticalScrollIndicator={false}
				/>
			)}
			{alertState.isOpen && (
				<CustomAlert
					isVisible={true}
					hasCancel
					extraTitleStyle="text-white text-center -ml-2"
					extraOkBtnStyle={colorScheme == 'dark' ? 'text-white' : 'text-black'}
					message={alertState.message}
					title="Delete"
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
						handleMute(alertState.selectedId, alertState.isMuted);
					}}
					type="error"
				/>
			)}
		</SafeScreen>
	);
};

export default AllMutedContributorList;
