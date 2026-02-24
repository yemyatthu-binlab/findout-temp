import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth/authStore';
import {
	useDeleteProfileMediaMutation,
	useProfileMutation,
} from '@/hooks/mutations/profile.mutation';
import { queryClient } from '@/App';
import {
	AccountInfoQueryKey,
	UpdateProfilePayload,
} from '@/types/queries/profile.type';
import { useProfileMediaStore } from '@/store/profile/useProfileMediaStore';
import { cleanText } from '@/util/helper/cleanText';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { BottomBarHeight, useGradualAnimation } from './useGradualAnimation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnimatedStyle } from 'react-native-reanimated';
import { Platform } from 'react-native';
import { DefaultBioTextForChannel } from '@/util/constant/socialMediaLinks';
import { useTranslation } from 'react-i18next';

type ProfileType = {
	display_name?: string;
	bio?: string;
};

export const useEditProfile = () => {
	const { t } = useTranslation();
	const navigation = useNavigation();
	const {
		userInfo,
		actions: { setUserInfo },
	} = useAuthStore();
	const [profile, setProfile] = useState<ProfileType>();
	const { header, avatar, actions } = useProfileMediaStore();
	const { height } = useGradualAnimation();
	const { top } = useSafeAreaInsets();
	const [delConfAction, setDelConfAction] = useState<{
		visible: boolean;
		title?: 'header' | 'avatar';
	}>({ visible: false });

	useEffect(() => {
		if (userInfo) {
			setProfile({
				display_name: userInfo.display_name,
				bio: cleanText(userInfo?.note) || '',
			});
			actions.onSelectMedia(
				'avatar',
				userInfo?.avatar || userInfo.avatar_static,
			);
			actions.onSelectMedia(
				'header',
				userInfo.header || userInfo.header_static,
			);
		}
	}, [userInfo]);

	// Const
	const acctInfoQueryKey: AccountInfoQueryKey = [
		'get_account_info',
		{ id: userInfo?.id!, domain_name: process.env.API_URL ?? '' },
	];

	const timelineQueryKeys = [
		[
			'channel-feed',
			{
				domain_name: process.env.API_URL ?? '',
				only_media: false,
				remote: false,
				local: true,
			},
		],
		[
			'account-detail-feed',
			{
				domain_name: process.env.API_URL ?? '',
				account_id: userInfo?.id,
				exclude_replies: true,
				exclude_reblogs: true,
				exclude_original_statuses: false,
			},
		],
	];

	// mutations
	const { mutateAsync, isPending: isUpdatingProfile } = useProfileMutation({
		onSuccess: response => {
			queryClient.invalidateQueries({ queryKey: acctInfoQueryKey });

			timelineQueryKeys.forEach(key => {
				queryClient.invalidateQueries({ queryKey: key });
			});

			setUserInfo(response);
			navigation.goBack();
			// 	text1: 'Your profile has been updated successfully!',
			// 	position: 'top',
			// 	topOffset: Platform.OS == 'android' ? 25 : 50,
			// 	visibilityTime: 1000,
			// 	onHide: () =>
			// 		navigation.navigate('Index', {
			// 			screen: 'Home',
			// 			params: {
			// 				screen: 'HomeFeed',
			// 			},
			// 		}),
			// });
			Toast.show({
				type: 'successToast',
				text1: t('timeline.profile_update_success'),
				position: 'top',
				topOffset: Platform.OS == 'android' ? 25 : 50,
			});
		},
		onError: error => {
			Toast.show({
				type: 'errorToast',
				text1: error?.message || t('common.error'),
				position: 'top',
				topOffset: Platform.OS == 'android' ? 25 : 50,
				visibilityTime: 1000,
				onHide: () => {
					actions.onSelectMedia('header', []);
					actions.onSelectMedia('avatar', []);
					navigation.navigate('Index', {
						screen: 'Home',
						params: {
							screen: 'HomeFeed',
						},
					});
				},
			});
		},
	});
	const { mutate: deleteMedia, isPending: isDeletingMedia } =
		useDeleteProfileMediaMutation({
			onSuccess: (response, variables) => {
				actions.onSelectMedia(variables.mediaType, []);
				queryClient.invalidateQueries({ queryKey: acctInfoQueryKey });

				timelineQueryKeys.forEach(key => {
					queryClient.invalidateQueries({ queryKey: key });
				});

				setUserInfo(response);
				Toast.show({
					text1: t('toast.media_deleted', { media: variables.mediaType }),
					position: 'top',
					topOffset: Platform.OS == 'android' ? 25 : 50,
					visibilityTime: 1000,
				});
			},
			onError: error => {
				Toast.show({
					type: 'errorToast',
					text1: error?.message || t('common.error'),
					position: 'top',
					topOffset: Platform.OS == 'android' ? 25 : 50,
					visibilityTime: 1000,
				});
			},
		});

	// handlers
	const handleUpdateProfile = async () => {
		let payload: UpdateProfilePayload = {
			display_name: profile?.display_name,
			note: userInfo?.note?.includes(DefaultBioTextForChannel)
				? profile?.bio + ' ' + DefaultBioTextForChannel
				: profile?.bio,
		};
		payload.avatar =
			typeof avatar.selectedMedia === 'string'
				? avatar.selectedMedia
				: avatar.selectedMedia[0] || null;
		payload.header =
			typeof header.selectedMedia === 'string'
				? header.selectedMedia
				: header.selectedMedia[0] || null;
		mutateAsync(payload);
	};

	const handlePressDelConf = () => {
		if (delConfAction.title) {
			setDelConfAction({ visible: false });

			deleteMedia({ mediaType: delConfAction.title });
		}
	};

	// styles
	const virtualKeyboardContainerStyle = useAnimatedStyle(() => {
		return {
			height:
				height.value > BottomBarHeight ? height.value - BottomBarHeight : 0,
		};
	});

	return {
		profile,
		setProfile,
		userInfo,
		header,
		avatar,
		actions,
		top,
		delConfAction,
		setDelConfAction,
		handleUpdateProfile,
		handlePressDelConf,
		isUpdatingProfile,
		isDeletingMedia,
		virtualKeyboardContainerStyle,
	};
};
