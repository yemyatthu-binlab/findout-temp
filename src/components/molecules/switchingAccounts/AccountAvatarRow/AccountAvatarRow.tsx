import { View, Pressable } from 'react-native';
import { AuthState } from '@/util/storage';
import FastImage from '@d11/react-native-fast-image';
import { PlusIcon } from '@/util/svg/icon.profile';

type Props = {
	accounts: AuthState[];
	onPressAdd: () => void;
};

const AccountAvatarRow = ({ accounts, onPressAdd }: Props) => {
	const accountsToShow = accounts.slice(0, 2);

	return (
		<View className="flex-row items-center mb-4 mt-5 mr-4 justify-start">
			{accountsToShow.map((acc, idx) => (
				<FastImage
					key={acc.userInfo.username + acc.domain}
					source={{ uri: acc.userInfo.avatar }}
					className={`w-8 h-8 rounded-full border-2 bg-white border-white ${
						idx === 0 ? '' : 'ml-[-8]'
					}`}
				/>
			))}
			<Pressable
				onPress={onPressAdd}
				className={`items-center bg-white border-white justify-center w-8 h-8 rounded-full border-2 active:opacity-75 ${
					accountsToShow.length > 0 ? ' ml-[-8]' : ''
				}`}
				accessibilityRole="button"
				accessibilityLabel="Add account"
			>
				<PlusIcon fill={'#000'} />
			</Pressable>
		</View>
	);
};

export default AccountAvatarRow;
