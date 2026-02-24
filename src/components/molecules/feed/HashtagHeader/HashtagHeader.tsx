import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { calculateHashTagCount } from '@/util/helper/helper';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Platform, View } from 'react-native';
import { Button } from '@/components/atoms/common/Button/Button';
import { useHashtagFollowMutation } from '@/hooks/mutations/feed.mutation';
import Toast from 'react-native-toast-message';
import { Flow } from 'react-native-animated-spinkit';
import { queryClient } from '@/App';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppIcons } from '@/util/icons/icon.common';

interface HashtagHeaderProps {
	hashtagDetail: Patchwork.HashtagDetail;
	hashtag: string;
}

const HashtagHeader: React.FC<HashtagHeaderProps> = ({
	hashtagDetail,
	hashtag,
}) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const { mutate, isPending } = useHashtagFollowMutation({
		onSuccess: response => {
			queryClient.setQueryData(
				['hashtag-detail', { domain_name: process.env.API_URL, hashtag }],
				response,
			);
			queryClient.invalidateQueries({
				queryKey: ['hashtags-following'],
				exact: false,
			});
		},
		onError: e => {
			Toast.show({
				type: 'errorToast',
				text1: e.message,
				position: 'top',
				topOffset: Platform.OS == 'android' ? 25 : 50,
			});
		},
	});

	const totalPosts = useMemo(() => {
		if (hashtagDetail)
			return calculateHashTagCount(hashtagDetail.history, 'uses');
	}, [hashtagDetail]);

	const totalParticipant = useMemo(() => {
		if (hashtagDetail) {
			return calculateHashTagCount(hashtagDetail.history, 'accounts');
		}
	}, [hashtagDetail]);

	const getTodayPostCount = (hashtag: Patchwork.HashtagHistory) => {
		const date = dayjs.unix(parseInt(hashtag.day));
		const isToday = date.isSame(dayjs(), 'day');
		if (isToday) {
			return hashtag.uses;
		}
		return 0;
	};

	const handleFollowPress = () => {
		mutate({ hashtag, isAlreadyFollowing: !!hashtagDetail?.following });
	};

	return (
		<View className="flex-row mx-4 items-center bg-patchwork-light-50 dark:bg-patchwork-dark-900 rounded-lg p-3">
			<View className="flex-1 flex-shrink mt-[2]">
				<View className="flex-row">
					<FontAwesomeIcon
						icon={AppIcons.timeline}
						size={15}
						color={colorScheme === 'dark' ? '#fff' : '#000'}
					/>
					<ThemeText
						variant="textGrey"
						size="xs_12"
						className="font-bold mx-2"
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{`${totalPosts} ${t('hashtag_detail.post', {
							count: totalPosts,
						})}`}
					</ThemeText>
				</View>
				<View className="flex-row my-1.5">
					<FontAwesomeIcon
						icon={AppIcons.users}
						size={15}
						color={colorScheme === 'dark' ? '#fff' : '#000'}
					/>
					<ThemeText
						variant="textGrey"
						size="xs_12"
						className="font-bold mx-2"
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{`${totalParticipant} ${t('hashtag_detail.participant', {
							count: totalParticipant,
						})}`}
					</ThemeText>
				</View>
				{/* <View className="flex-row">
					<FontAwesomeIcon
						icon={AppIcons.schedule}
						size={14}
						color={colorScheme === 'dark' ? '#fff' : '#000'}
					/>
					<ThemeText
						variant="textGrey"
						size="xs_12"
						className="font-bold mx-2"
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{`${getTodayPostCount(hashtagDetail.history[0])} ${t(
							'hashtag_detail.post',
							{ count: Number(getTodayPostCount(hashtagDetail.history[0])) },
						)} ${t('hashtag_detail.today')}`}
					</ThemeText>
				</View> */}
			</View>
			<Button
				variant={'outline'}
				onPress={handleFollowPress}
				className="h-8 ml-4 rounded-full"
			>
				{isPending ? (
					<Flow
						size={15}
						color={colorScheme == 'dark' ? 'white' : 'black'}
						className="mx-3"
					/>
				) : (
					<ThemeText className="text-xs -mt-[2]">
						{hashtagDetail?.following
							? t('timeline.unfollow')
							: t('timeline.follow')}
					</ThemeText>
				)}
			</Button>
		</View>
	);
};

export default HashtagHeader;
