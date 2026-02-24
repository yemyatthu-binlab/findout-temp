import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Dimensions, useWindowDimensions } from 'react-native';
import { memo, useState } from 'react';
import StandardEmojiTab from '@/components/molecules/compose/StandardEmojiTab/StandardEmojiTab';
import { TabView } from 'react-native-tab-view';
import TabBar from '@/components/molecules/common/TabBar/TabBar';
import CustomEmojiTab from '@/components/molecules/compose/CustomEmojiTab/CustomEmojiTab';
import customColor from '@/util/constant/color';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

const screenHeight = Dimensions.get('window').height;

interface TabViewRoute {
	key: string;
	title: string;
}
interface Props {
	isVisible: boolean;
	onClose: () => void;
}
const EmojiModal = ({ isVisible, onClose }: Props) => {
	const [index, setIndex] = useState(0);
	const layout = useWindowDimensions();
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();

	const [routes] = useState<TabViewRoute[]>([
		// Use translation keys for titles
		{ key: 'standard', title: t('compose.standard_emoji_tab') },
		{ key: 'custom', title: t('compose.custom_emoji_tab') },
	]);

	const renderScene = ({ route }: { route: TabViewRoute }) => {
		switch (route.key) {
			case 'standard':
				return <StandardEmojiTab onClose={onClose} />;
			case 'custom':
				return <CustomEmojiTab onClose={onClose} />;

			default:
				return <></>;
		}
	};

	return (
		<ThemeModal
			onClose={onClose}
			type="alternative"
			position="bottom"
			visible={isVisible}
			hasNotch
			modalHeight={screenHeight * 0.7}
		>
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
				swipeEnabled={true}
				renderTabBar={props => (
					<TabBar
						{...props}
						style={{
							backgroundColor:
								colorScheme === 'dark'
									? customColor['patchwork-dark-100']
									: customColor['patchwork-light-900'],
						}}
						renderLabel={({ route, focused }) => (
							<ThemeText
								size="md_16"
								className={`font-NewsCycle_Bold ${
									focused
										? 'text-black dark:text-white'
										: 'text-slate-400 dark:text-patchwork-grey-100'
								}`}
							>
								{route.title}
							</ThemeText>
						)}
					/>
				)}
			/>
		</ThemeModal>
	);
};

export default memo(EmojiModal);
