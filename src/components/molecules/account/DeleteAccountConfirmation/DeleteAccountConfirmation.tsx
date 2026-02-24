import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Underline from '@/components/atoms/common/Underline/Underline';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Image from '@/components/atoms/common/Image/Image';
import { useAuthStore } from '@/store/auth/authStore';

type Props = {
	handleClick: () => void;
};

const DeleteAccountConfirmation = ({ handleClick }: Props) => {
	const { userInfo } = useAuthStore();

	return (
		<View className="mx-5 flex-1">
			<View className="flex-row items-center ">
				<Image
					className="w-12 h-12 rounded-full"
					uri={userInfo?.avatar}
					resizeMode={'cover'}
				/>
				<View className="ml-2 items-center mb-0">
					<ThemeText emojis={userInfo?.emojis} className="mr-3">
						{userInfo?.display_name || userInfo?.username}
					</ThemeText>
					<ThemeText>@{userInfo?.acct}</ThemeText>
				</View>
			</View>
			<View className="mt-5">
				<ThemeText size="md_16">
					Your account and all associated personal data will be permanently
					deleted from our records. This action cannot be undone. Please confirm
					if you wish to proceed.
				</ThemeText>
				<Underline className="my-5" />
			</View>
			<View className="items-center flex-1 justify-end mb-8">
				<Pressable onPress={handleClick} className="active:opacity-80">
					<ThemeText size="md_16" className="text-red-500 font-NewsCycle_Bold">
						Delete account
					</ThemeText>
				</Pressable>
			</View>
		</View>
	);
};

export default DeleteAccountConfirmation;
