/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import Avatar from '@/components/atoms/profile/Avatar';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { View, ScrollView } from 'react-native';
import Underline from '@/components/atoms/common/Underline/Underline';

const ContributorProgress = () => {
	return (
		<View className="pb-28">
			<ThemeText className="mb-4" variant={'textGrey'}>
				We've pre-selected the best contributors to follow based on your chosen
				interests.
			</ThemeText>
			<ScrollView className="mb-20" showsVerticalScrollIndicator={false}>
				<View></View>
			</ScrollView>
		</View>
	);
};

export default ContributorProgress;
