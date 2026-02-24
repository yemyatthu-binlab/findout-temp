import React from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { ProfileNameRedMark } from '@/util/svg/icon.profile';
import { useAuthStore } from '@/store/auth/authStore';
import { useColorScheme } from 'nativewind';
import UserRole from '../UserRole/UserRole';

type AccountNameProps = {
	accountName: string;
	acctNameTextStyle?: string;
	hasRedMark?: boolean;
	emojis?: Patchwork.Emoji[];
	userRoles?: Patchwork.Role[] | undefined;
	onPress?: () => void;
};

const AccountName = ({
	accountName,
	acctNameTextStyle,
	hasRedMark,
	emojis,
	userRoles,
	onPress,
	...props
}: AccountNameProps & ViewProps) => {
	const { colorScheme } = useColorScheme();

	return (
		<Pressable
			className="flex-wrap flex-row items-center"
			onPress={onPress}
			{...props}
		>
			<ThemeText
				emojis={emojis}
				className={`font-NewsCycle_Bold text-[17px] mr-2 leading-6 ${acctNameTextStyle}`}
			>
				{accountName}
			</ThemeText>
			{hasRedMark && <ProfileNameRedMark colorScheme={colorScheme} />}
			<UserRole userRoles={userRoles} />
		</Pressable>
	);
};

export default AccountName;
