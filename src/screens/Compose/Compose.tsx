import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { SettingStackScreenProps, TabBarScreenProps } from '@/types/navigation';
import { ComposeStatusProvider } from '@/context/composeStatusContext/composeStatus.context';
import ComposeContent from '@/components/organisms/compose/ComposeContent/ComposeContent';

export type ComposeScreenProps =
	| TabBarScreenProps<'Compose'>
	| SettingStackScreenProps<'Compose'>;

const Compose = ({ route }: ComposeScreenProps) => {
	const composeParams = route.params;

	return (
		<SafeScreen>
			<ComposeStatusProvider type={composeParams.type}>
				<ComposeContent composeParams={composeParams} />
			</ComposeStatusProvider>
		</SafeScreen>
	);
};

export default Compose;
