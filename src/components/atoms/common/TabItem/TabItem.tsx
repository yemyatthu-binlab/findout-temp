import { Pressable, Text } from 'react-native';
import styles from './TabItem.style';

export type TabItemProps = {
	tab: { value: string; label: string };
	onTabPress: (value: string) => void;
	currentTab: string;
};

const TabItem = ({ tab, onTabPress, currentTab }: TabItemProps) => {
	const isActiveTab = tab?.value === currentTab;

	return (
		<Pressable
			onPress={() => onTabPress(tab?.value)}
			className={styles.tabItem(isActiveTab)}
			testID="tabItem-wrapper"
		>
			<Text className={styles.tabItemText(isActiveTab)} testID="tabItem-text">
				{tab?.label}
			</Text>
		</Pressable>
	);
};

export default TabItem;
