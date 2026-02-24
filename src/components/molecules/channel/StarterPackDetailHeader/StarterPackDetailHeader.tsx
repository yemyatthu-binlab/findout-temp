import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StarterPackDetailHeaderProps {
	title: string;
	description: string;
	collected_by: string;
	gradientColors: string[];
}

const HEADER_CONTENT_HEIGHT = 250;

export const StarterPackDetailHeader: React.FC<
	StarterPackDetailHeaderProps
> = ({ title, description, collected_by, gradientColors }) => {
	const { top: safeAreaTop } = useSafeAreaInsets();

	return (
		<View
			className="mb-10 overflow-hidden"
			style={{ height: HEADER_CONTENT_HEIGHT + safeAreaTop }}
		>
			<LinearGradient
				colors={gradientColors}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="absolute top-0 left-0 right-0 bottom-0"
			/>
			<LinearGradient
				colors={['transparent', '#fff5']}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				className="absolute top-0 left-0 right-0 bottom-0"
			/>
			<View className="w-[250] h-[250] bg-white/10 absolute -top-20 -right-14 rounded-full" />
			<View style={{ paddingTop: safeAreaTop + 60 }} className="px-4">
				<ThemeText className="font-NewsCycle_Bold text-3xl text-white mb-1">
					{title}
				</ThemeText>
				<ThemeText className="text-white/90 mb-3" size={'fs_13'}>
					{description}
				</ThemeText>
				<View className="mb-4 flex-row items-center">
					<ThemeText size={'xs_12'} className="text-white/80">
						Collected by{' '}
					</ThemeText>
					<ThemeText className="font-NewsCycle_Bold text-white">
						{collected_by}
					</ThemeText>
				</View>
			</View>
		</View>
	);
};
