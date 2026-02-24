import { View } from 'react-native';
import TabItem from '../../../atoms/common/TabItem/TabItem';

type TabItemProp = {
	value: string;
	label: string;
};

type Props = {
	tabs: TabItemProp[];
	onTabPress: (tab: string) => void;
	currentTab: string;
};

const TabSwitch = ({ tabs, onTabPress, currentTab }: Props) => {
	return (
		<View>
			<View className="my-4 flex flex-row bg-patchwork-light-50 dark:bg-patchwork-dark-50 rounded-md p-1 dark:p-0">
				{Array.isArray(tabs) &&
					tabs.length >= 1 &&
					tabs.map((tab, index) => (
						<TabItem {...{ tab, currentTab, onTabPress }} key={index} />
					))}
			</View>
		</View>
	);
};

export default TabSwitch;
