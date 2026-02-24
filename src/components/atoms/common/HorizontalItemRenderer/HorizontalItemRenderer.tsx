import { View } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

type Props<T> = {
	data: T[];
	renderItem: (item: T, index?: number) => React.ReactElement;
};

const HorizontalItemRenderer = <T,>({ data, renderItem }: Props<T>) => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			scrollEnabled={data.length >= 2}
		>
			{data.map((item, idx) => (
				<View key={idx}>{renderItem(item, idx)}</View>
			))}
		</ScrollView>
	);
};

export default HorizontalItemRenderer;
