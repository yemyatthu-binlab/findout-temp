/* eslint-disable react/destructuring-assignment */
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Pressable } from 'react-native';

const CountryItem = (country: Patchwork.Country) => {
	return (
		<Pressable className="flex flex-row items-center py-2">
			<ThemeText>{country.emoji_flag}</ThemeText>
			<ThemeText>{country.common_name}</ThemeText>
		</Pressable>
	);
};

export default CountryItem;
