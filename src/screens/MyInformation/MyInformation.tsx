import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import MyInfoItem from '@/components/atoms/muteblock/MyInfoItem/MyInfoItem';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { useGetNewsmastAccountDetail } from '@/hooks/queries/auth.queries';
import { useAuthStore } from '@/store/auth/authStore';
import { useActiveDomainStore } from '@/store/feed/activeDomain';
import { SettingStackParamList } from '@/types/navigation';
import { DEFAULT_INSTANCE, NEWSMAST_INSTANCE_V1 } from '@/util/constant';
import { PhoneIcon, ProfileEmailIcon } from '@/util/svg/icon.common';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const MyInformation = () => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const navigation =
		useNavigation<StackNavigationProp<SettingStackParamList>>();
	const { userInfo, userOriginInstance } = useAuthStore();
	const { domain_name } = useActiveDomainStore();
	const { data: newsmastAccountInfo, isLoading } = useGetNewsmastAccountDetail({
		domain_name: domain_name,
		options: {
			enabled: userOriginInstance === NEWSMAST_INSTANCE_V1,
		},
	});

	return (
		<SafeScreen>
			<Header
				title={t('screen.my_information')}
				leftCustomComponent={<BackButton />}
			/>
			<View>
				<MyInfoItem
					label={t('login.email')}
					value={
						userOriginInstance === NEWSMAST_INSTANCE_V1
							? newsmastAccountInfo?.email
							: userInfo?.source?.email
					}
					icon={<ProfileEmailIcon {...{ colorScheme }} />}
					onPress={() =>
						navigation.navigate('ChangeEmail', {
							oldEmail:
								userOriginInstance === NEWSMAST_INSTANCE_V1
									? newsmastAccountInfo?.email!
									: userInfo?.source?.email!,
						})
					}
				/>
				{/* <MyInfoItem
					label={t('login.phone_number')}
					value={userInfo?.source?.phone}
					icon={<PhoneIcon {...{ colorScheme }} />}
				/> */}
			</View>
		</SafeScreen>
	);
};

export default MyInformation;
