import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppIcons } from '@/util/icons/icon.common';
import customColor from '@/util/constant/color';

const NotificationListEmpty = () => {
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();

	return (
		<View style={styles.container}>
			<FontAwesomeIcon
				icon={AppIcons.noNotification}
				size={35}
				color={colorScheme == 'dark' ? '#fff' : '#000'}
			/>
			<ThemeText
				size={'lg_18'}
				className="my-2 tracking-widest text-center font-NewsCycle_Bold"
			>
				{t('notifications.empty.title')}
			</ThemeText>
			<ThemeText size={'sm_14'} className="tracking-wider text-center px-3">
				{t('notifications.empty.description')}
			</ThemeText>
		</View>
	);
};

export default NotificationListEmpty;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		height: Dimensions.get('screen').height * 0.4,
	},
});
