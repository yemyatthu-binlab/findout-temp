import { PlusIcon } from '@/util/svg/icon.conversations';
import { Pressable, PressableProps } from 'react-native';

type FloatingAddButtonProps = {
	onPress: () => void;
} & PressableProps;

export const FloatingAddButton = ({
	onPress,
	...props
}: FloatingAddButtonProps) => (
	<Pressable
		onPress={onPress}
		className="bg-patchwork-primary dark:bg-patchwork-primary-dark rounded-full p-3 absolute bottom-5 right-5"
		{...props}
	>
		<PlusIcon />
	</Pressable>
);
