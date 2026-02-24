import { Platform, StatusBar } from 'react-native';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import { ComposeStatusProvider } from '@/context/composeStatusContext/composeStatus.context';
import ComposeContent from '@/components/organisms/compose/ComposeContent/ComposeContent';
import { HomeStackScreenProps } from '@/types/navigation';
import { useColorScheme } from 'nativewind';
import customColor from '@/util/constant/color';

const QuotePost = ({ route }: HomeStackScreenProps<'QuotePost'>) => {
	const { colorScheme } = useColorScheme();
	const { statusId } = route.params;
	return (
		<SafeScreen
			style={{
				flex: 1,
				backgroundColor:
					colorScheme === 'dark' ? customColor['patchwork-dark-100'] : '#fff',
				paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 15,
			}}
		>
			<ComposeStatusProvider type={'quote'}>
				<ComposeContent composeParams={{ type: 'quote', statusId }} />
			</ComposeStatusProvider>
		</SafeScreen>
	);
};

export default QuotePost;
