import customColor from '@/util/constant/color';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { View, ActivityIndicator, Text, Modal } from 'react-native';

interface LoadingModalProps {
	isVisible: boolean;
	message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isVisible, message }) => {
	const { colorScheme } = useColorScheme();
	return (
		<Modal
			transparent
			visible={isVisible}
			animationType="fade"
			statusBarTranslucent
			navigationBarTranslucent
		>
			<View className="flex-1 bg-black/50 justify-center items-center">
				<View className=" px-6 py-4 rounded-lg items-center">
					<ActivityIndicator
						size="large"
						color={
							colorScheme === 'dark'
								? customColor['patchwork-primary-dark']
								: customColor['patchwork-primary']
						}
					/>
					{message && (
						<Text className="text-lg font-medium text-white mt-4">
							{message}
						</Text>
					)}
				</View>
			</View>
		</Modal>
	);
};

export default LoadingModal;
