import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { CaretRightIcon } from '@/util/svg/icon.common';
import { Pressable } from 'react-native-gesture-handler';

type UserNameProps = {
	username: string;
	joinedDate?: string;
	onPress?: () => void;
};

const UserName = ({ username, joinedDate = '', onPress }: UserNameProps) => {
	if (!username) return null;
	return (
		<Pressable onPress={onPress} className="active:opacity-90" hitSlop={4}>
			<ThemeText size="xs_12" variant="textGrey">
				{username?.includes('@') ? '' : '@'}
				{username}{' '}
				{joinedDate && (
					<ThemeText size="xs_12" variant="textGrey">
						<CaretRightIcon /> {joinedDate}
					</ThemeText>
				)}
			</ThemeText>
		</Pressable>
	);
};

export default UserName;
