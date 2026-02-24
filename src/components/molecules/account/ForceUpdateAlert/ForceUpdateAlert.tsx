import { View, Text, Platform, Linking } from 'react-native';
import CustomAlert from '@/components/atoms/common/CustomAlert/CustomAlert';
import { useTranslation } from 'react-i18next';

const ForceUpdateAlert = () => {
	const { t } = useTranslation();
	return (
		<View>
			<CustomAlert
				isVisible={true}
				message={t('common.update_required_message')}
				title={t('common.update_required')}
				handleCancel={() => {}}
				handleOk={() => {
					if (Platform.OS == 'ios') {
						Linking.openURL(
							'https://apps.apple.com/ie/app/channels-app/id6749952762',
						);
					} else {
						Linking.openURL(
							`https://play.google.com/store/apps/details?id=com.mome.app`,
						);
					}
				}}
				confirmBtnText={t('common.update')}
				type="info"
			/>
		</View>
	);
};

export default ForceUpdateAlert;
