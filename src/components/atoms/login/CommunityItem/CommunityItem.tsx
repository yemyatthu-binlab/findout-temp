import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Check } from '@/util/svg/icon.common';

type Props = {
	community: Patchwork.Collection;
};

const CommunityItem = ({ community }: Props) => {
	const [isSelected, setIsSelected] = useState(false);

	return (
		<Pressable
			onPress={() => {
				setIsSelected(prev => !prev);
			}}
			className={`mr-2 my-1 py-2 px-2 rounded-2xl items-center ${
				isSelected ? 'bg-patchwork-red-50' : 'bg-patchwork-dark-50'
			}`}
		>
			<View className="flex flex-row justify-center items-center">
				<ThemeText size="xs_12" className="text-white">
					{community.name}
				</ThemeText>
				{isSelected && <Check className="ml-2" />}
			</View>
		</Pressable>
	);
};

export default CommunityItem;
