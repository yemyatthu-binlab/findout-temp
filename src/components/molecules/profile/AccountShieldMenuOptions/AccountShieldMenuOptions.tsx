import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import {
	createRelationshipQueryKey,
	useCheckRelationships,
	useSpecificServerProfile,
} from '@/hooks/queries/profile.queries';
import { MenuOption } from 'react-native-popup-menu';
import MenuOptionIcon from '@/components/atoms/feed/StatusMenu/MenuOptionIcon/MenuOptionIcon';
import ReportContentModal from '@/components/atoms/feed/StatusMenu/ReportMenuOption/ReportContentModal/ReportContentModal';
import { useActiveDomainStore } from '@/store/feed/activeDomain';
import {
	useBlockUnBlockUserMutation,
	useMuteUnmuteUserMutation,
} from '@/hooks/queries/feed.queries';
import { GetChannelFeedQueryKey } from '@/types/queries/channel.type';
import { queryClient } from '@/App';
import Toast from 'react-native-toast-message';
import { Flow } from 'react-native-animated-spinkit';
import customColor from '@/util/constant/color';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppIcons } from '@/util/icons/icon.common';

const AccountShieldMenuOptions = ({
	account,
	hideMenu,
	navigation,
}: {
	account: Patchwork.Account;
	hideMenu: () => void;
	navigation: any;
}) => {
	const { t } = useTranslation();
	const { domain_name } = useActiveDomainStore();
	const accountId = account.id; // Use for query caching purpose //
	const { colorScheme } = useColorScheme();
	const [showModal, setShowModal] = useState(false);

	// ***** Get Specific Server Profile ***** //
	const { data: specificServerProfile } = useSpecificServerProfile({
		q: account.url as string,
		options: {
			enabled: !!account.url,
		},
	});
	// ***** Get Specific Server Profile ***** //

	// ***** Check Relationship To Other Accounts ***** //
	const { data: relationships } = useCheckRelationships({
		accountIds: [specificServerProfile?.accounts[0]?.id || ''],
		options: {
			enabled: !!specificServerProfile?.accounts[0]?.id,
		},
	});
	// ***** Check Relationship To Other Accounts ***** //

	const { mutate, isPending } = useBlockUnBlockUserMutation({
		onSuccess: response => {
			navigation.goBack();
			const channelFeedQueryKey: GetChannelFeedQueryKey = [
				'channel-feed',
				{ domain_name, remote: false, only_media: false },
			];
			queryClient.setQueryData<IFeedQueryFnData>(channelFeedQueryKey, old => {
				if (!old) return old;
				return {
					...old,
					pages: old.pages.map(page => ({
						...page,
						data: page.data.filter(status => status.account?.id !== accountId),
					})),
				};
			});

			const actionText = `${
				account?.display_name ?? account.username
			} has been blocked`;

			const relationshipQueryKey = createRelationshipQueryKey([accountId]);

			queryClient.setQueryData<Patchwork.RelationShip[]>(
				relationshipQueryKey,
				old => {
					if (!old) return [response];
					return old.map(rel =>
						rel.id === accountId ? { ...rel, ...response } : rel,
					);
				},
			);

			Toast.show({
				type: 'successToast',
				text1: t('toast.user_blocked', {
					user: account?.display_name ?? account.username,
				}),

				position: 'top',
				topOffset: Platform.OS == 'android' ? 25 : 50,
			});
			hideMenu();
		},
	});

	const { mutate: toggleMute, isPending: isMuteInProgress } =
		useMuteUnmuteUserMutation({
			onSuccess: response => {
				navigation.goBack();
				const channelFeedQueryKey: GetChannelFeedQueryKey = [
					'channel-feed',
					{ domain_name, remote: false, only_media: false },
				];
				queryClient.setQueryData<IFeedQueryFnData>(channelFeedQueryKey, old => {
					if (!old) return old;
					return {
						...old,
						pages: old.pages.map(page => ({
							...page,
							data: page.data.filter(
								status => status.account?.id !== accountId,
							),
						})),
					};
				});

				const relationshipQueryKey = createRelationshipQueryKey([accountId]);

				queryClient.setQueryData<Patchwork.RelationShip[]>(
					relationshipQueryKey,
					old => {
						if (!old) return [response];
						return old.map(rel =>
							rel.id === accountId ? { ...rel, ...response } : rel,
						);
					},
				);

				Toast.show({
					type: 'successToast',
					text1: t('toast.user_muted', {
						user: account?.display_name ?? account.username,
					}),
					position: 'top',
					topOffset: Platform.OS == 'android' ? 25 : 50,
				});
				hideMenu();
			},
		});

	const onMakeBlockUnBlockUser = () => {
		mutate({
			accountId: specificServerProfile?.accounts[0]?.id || '',
			toBlock: true,
		});
	};

	const onToggleMuteUnmuteUser = () => {
		toggleMute({
			accountId: specificServerProfile?.accounts[0]?.id || '',
			toMute: true,
		});
	};

	const blockMenuDisabled =
		!specificServerProfile?.accounts[0]?.id || !relationships || isPending;

	const muteMenuDisabled =
		!specificServerProfile?.accounts[0]?.id ||
		!relationships ||
		isMuteInProgress;

	return (
		<>
			<MenuOption
				onSelect={onToggleMuteUnmuteUser}
				disableTouchable={muteMenuDisabled}
			>
				<View className="flex-row items-center">
					<View className="w-9 h-9 items-center justify-center">
						<FontAwesomeIcon
							icon={AppIcons.mute}
							color={
								colorScheme == 'dark'
									? '#fff'
									: customColor['patchwork-grey-100']
							}
							size={18}
						/>
					</View>
					{isMuteInProgress ? (
						<Flow
							size={25}
							color={
								colorScheme === 'dark'
									? customColor['patchwork-light-900']
									: colors.gray[500]
							}
							className="ml-1"
						/>
					) : (
						<ThemeText size={'sm_14'} className="font-Inter_Regular ml-1">
							{t('timeline.mute')}
						</ThemeText>
					)}
				</View>
			</MenuOption>

			<MenuOption
				onSelect={onMakeBlockUnBlockUser}
				disableTouchable={blockMenuDisabled}
			>
				<View className="flex-row items-center">
					<View className="w-9 h-9 items-center justify-center">
						<FontAwesomeIcon
							icon={AppIcons.block}
							color={
								colorScheme == 'dark'
									? '#fff'
									: customColor['patchwork-grey-100']
							}
							size={18}
						/>
					</View>
					{isPending ? (
						<Flow
							size={25}
							color={
								colorScheme === 'dark'
									? customColor['patchwork-light-900']
									: colors.gray[500]
							}
							className="ml-1"
						/>
					) : (
						<ThemeText size={'sm_14'} className="font-Inter_Regular ml-1">
							{t('timeline.block')}
						</ThemeText>
					)}
				</View>
			</MenuOption>

			<MenuOption
				onSelect={() => {
					setShowModal(true);
				}}
			>
				<MenuOptionIcon
					icon={
						<FontAwesomeIcon
							icon={AppIcons.report}
							color={
								colorScheme == 'dark'
									? '#fff'
									: customColor['patchwork-grey-100']
							}
							size={18}
						/>
					}
					name={t('timeline.report')}
				/>
			</MenuOption>
			{showModal && (
				<ReportContentModal
					visible={showModal}
					onClose={() => {
						setShowModal(false);
						hideMenu();
					}}
					account={account}
				/>
			)}
		</>
	);
};

export default AccountShieldMenuOptions;
