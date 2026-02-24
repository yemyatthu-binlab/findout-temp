import { useEffect, useState } from 'react';
import {
	Dimensions,
	Modal,
	Pressable,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import customColor from '@/util/constant/color';
import { cn } from '@/util/helper/twutil';
import { ThemeText } from '../ThemeText/ThemeText';
import Underline from '../Underline/Underline';
import { isTablet } from '@/util/helper/isTablet';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');

interface StatusDeleteModalProps {
	openDeleteModal: boolean;
	onPressHideDeleteModal: () => void;
	handleDeleteStatus: () => void;
}

const StatusDeleteModal = ({
	openDeleteModal,
	onPressHideDeleteModal,
	handleDeleteStatus,
}: StatusDeleteModalProps) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		if (openDeleteModal) {
			const timeout = setTimeout(() => setIsMounted(true), 180);
			return () => {
				clearTimeout(timeout);
				setIsMounted(false);
			};
		} else {
			setIsMounted(false);
		}
	}, [openDeleteModal]);

	return (
		<Modal
			onRequestClose={onPressHideDeleteModal}
			transparent
			visible={openDeleteModal}
			animationType="fade"
			statusBarTranslucent
			navigationBarTranslucent
		>
			<View style={styles.centeredView}>
				<TouchableOpacity
					style={styles.backdrop}
					onPress={onPressHideDeleteModal}
					activeOpacity={1}
				/>
				{isMounted && (
					<View
						style={[
							styles.modalContainer,
							{
								backgroundColor:
									colorScheme === 'dark'
										? customColor['patchwork-dark-100']
										: customColor['patchwork-light-900'],
							},
						]}
					>
						<View className={cn('px-8 py-5 min-w-[250]')}>
							<ThemeText
								variant={'default'}
								size={'lg_18'}
								className={cn(
									'font-NewsCycle_Bold mb-3 text-center',
									colorScheme === 'dark' ? 'text-white' : 'text-black',
								)}
							>
								{t('timeline.deleteModal.title')}
							</ThemeText>
							<ThemeText className="text-center" size={'md_16'}>
								{t('timeline.deleteModal.description')}
							</ThemeText>
						</View>
						<Underline />
						<View className="flex-row items-center justify-around my-1">
							<Pressable
								className="w-1/2 active:opacity-80"
								onPress={onPressHideDeleteModal}
							>
								<ThemeText className={cn('text-center py-2')} size={'sm_14'}>
									{t('timeline.deleteModal.cancel')}
								</ThemeText>
							</Pressable>
							<Pressable
								className="w-1/2 active:opacity-80"
								hitSlop={{ top: 3, bottom: 3, left: 0, right: 0 }}
								onPress={handleDeleteStatus}
							>
								<ThemeText
									className={cn('text-center py-2')}
									size={'sm_14'}
									variant={'textOrange'}
								>
									{t('timeline.deleteModal.delete')}
								</ThemeText>
							</Pressable>
						</View>
					</View>
				)}
			</View>
		</Modal>
	);
};

export default StatusDeleteModal;

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	backdrop: {
		position: 'absolute',
		width: '100%',
		height: '100%',
	},
	modalContainer: {
		width: screenWidth * (isTablet ? 0.5 : 0.8),
		maxWidth: screenWidth * (isTablet ? 0.5 : 0.8),
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
	},
});
