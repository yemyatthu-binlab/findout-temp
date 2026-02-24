import React, { memo, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '@/types/navigation';
import { Button } from '@/components/atoms/common/Button/Button';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import VerticalInfo from '@/components/molecules/account/UserAccountInfo/UserAccountInfo';
import { useAuthStore } from '@/store/auth/authStore';
import {
	useBlockUnBlockUserMutation,
	useMuteUnmuteUserMutation,
} from '@/hooks/queries/feed.queries';
import {
	updateBlockState,
	updateMuteState,
} from '@/util/cache/statusActions/muteblockCache';
import { checkIsAccountVerified } from '@/util/helper/helper';
import { isAccount } from '@/util/helper/typeGuard';
import { cn } from '@/util/helper/twutil';
import Image from '../../common/Image/Image';

type Props = { user: Patchwork.MuteBlockUserAccount; type: 'block' | 'mute' };

const MuteBlockUserItem = ({ user, type }: Props) => {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const { t } = useTranslation();
	const { userInfo } = useAuthStore();

	const { mutate: toggleMute, isPending: isMuteInProgress } =
		useMuteUnmuteUserMutation({
			onSuccess: response => {
				updateMuteState(response);
			},
		});

	const { mutate: toggleBlock, isPending: isBlockInProgress } =
		useBlockUnBlockUserMutation({
			onSuccess: response => {
				updateBlockState(response);
			},
		});

	const onToggleMuteBtn = (item: Patchwork.MuteBlockUserAccount) => {
		if (isMuteInProgress || isBlockInProgress) return;

		if (type === 'block') {
			toggleBlock({ accountId: item.id, toBlock: !!item.isUnBlockedNow });
		} else {
			toggleMute({ accountId: item.id, toMute: !!item.isUnMutedNow });
		}
	};

	const isAccVerified = useMemo(() => {
		return checkIsAccountVerified(user.fields);
	}, [user.fields]);

	return (
		<View>
			<Pressable
				className="flex-row px-3 py-3"
				onPress={() => {
					navigation.push('ProfileOther', { id: user.id });
				}}
			>
				<View className="flex-1 flex-row mr-2">
					<Pressable onPress={() => {}}>
						<Image
							className={cn(
								'w-10 h-10 border border-patchwork-dark-50 rounded-full',
							)}
							uri={user.avatar}
						/>
					</Pressable>
					<VerticalInfo
						hasRedMark={isAccount(user) ? isAccVerified : false}
						accountName={user.display_name || user.username}
						username={user.acct}
						joinedDate={dayjs(user.created_at).format('MMM YYYY')}
						userBio={''}
						acctNameTextStyle="text-[14px]"
						emojis={user.emojis}
						userRoles={user.roles}
					/>
				</View>
				<Button
					variant="default"
					size="sm"
					className="bg-slate-100 dark:bg-white rounded-3xl px-6"
					onPress={() => onToggleMuteBtn(user)}
				>
					{isMuteInProgress || isBlockInProgress ? (
						<Flow size={15} color={'#000'} />
					) : (
						<ThemeText className="text-black" size={'fs_13'}>
							{type === 'block'
								? t(user.isUnBlockedNow ? 'timeline.block' : 'common.unblock')
								: t(user.isUnMutedNow ? 'timeline.mute' : 'common.unmute')}
						</ThemeText>
					)}
				</Button>
			</Pressable>
		</View>
	);
};

export default memo(MuteBlockUserItem);
