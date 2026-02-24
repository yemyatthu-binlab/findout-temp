import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import ThemeModal from '@/components/atoms/common/Modal/Modal';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { CloseIcon } from '@/util/svg/icon.common';
import { LinkIcon } from '@/util/svg/icon.profile';
import { useColorScheme } from 'nativewind';
import { Button } from '@/components/atoms/common/Button/Button';
import { useCTAactions } from '@/store/compose/callToAction/callToActionStore';
import { useTranslation } from 'react-i18next';

interface CallToActionModalProps {
	visible: boolean;
	onClose: () => void;
}
const CallToActionModal = ({ visible, onClose }: CallToActionModalProps) => {
	const { colorScheme } = useColorScheme();
	const { onChangeCTAText } = useCTAactions();
	const { t } = useTranslation();

	const [buttonText, setButtonText] = useState('');

	const handleAdd = () => {
		onChangeCTAText(buttonText);
		onClose();
	};
	return (
		<ThemeModal
			isFlex
			hasNotch={false}
			{...{
				openThemeModal: visible,
				onCloseThemeModal: onClose,
			}}
			containerStyle={{ borderRadius: 24 }}
		>
			<View className="flex-1 p-1">
				<View className="justify-center mb-2">
					{/* <ThemeText size={'md_16'} className="text-center font-NewsCycle_Bold">
						Add call to action
					</ThemeText> */}
					<TouchableOpacity
						activeOpacity={0.8}
						className=" absolute right-0"
						onPress={onClose}
					>
						<CloseIcon {...{ colorScheme }} />
					</TouchableOpacity>
				</View>

				<TextInput
					placeholder="Enter your button text here"
					extraInputStyle="h-11 my-3"
					onChangeText={setButtonText}
				/>
				<View className="my-2" />
				<TextInput
					placeholder="Enter link URL here"
					extraInputStyle="h-11 my-3"
					endIcon={<LinkIcon {...{ colorScheme }} />}
				/>

				<Button className="mt-3" onPress={handleAdd}>
					<ThemeText>{t('common.add')}</ThemeText>
				</Button>
			</View>
		</ThemeModal>
	);
};

export default CallToActionModal;
