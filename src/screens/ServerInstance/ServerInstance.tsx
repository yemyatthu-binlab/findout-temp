import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { GuestStackScreenProps } from '@/types/navigation';
import MastodonServerInstanceForm from '@/components/organisms/login/MastodonServerInstanceForm/MastodonServerInstanceForm';

export const ServerInstance: React.FC<
	GuestStackScreenProps<'ServerInstance'>
> = ({ navigation }) => {
	return (
		<SafeScreen>
			<Header hideUnderline title="" leftCustomComponent={<BackButton />} />
			<MastodonServerInstanceForm />
		</SafeScreen>
	);
};

export default ServerInstance;
