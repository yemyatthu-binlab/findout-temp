import {
	MaterialTabBar,
	MaterialTabItem,
	TabBarProps,
} from 'react-native-collapsible-tab-view';
import useAppropiateColorHash from '@/hooks/custom/useAppropiateColorHash';
import customColor from '@/util/constant/color';
import { isTablet } from '@/util/helper/isTablet';
import { Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTabBarTheme } from '@/hooks/custom/useTabBarTheme';

const { width: windowWidth } = Dimensions.get('window');

const MaterialTabBarWrapper = ({
	activeIndex,
	...props
}: TabBarProps & { activeIndex?: number }) => {
	const { i18n } = useTranslation();
	const isBurmese = i18n.language === 'my';
	const { barColor, tabBarTextColor } = useTabBarTheme();
	return (
		<MaterialTabBar
			keepActiveTabCentered
			{...props}
			indicatorStyle={{
				backgroundColor: tabBarTextColor,
				...(isTablet
					? {
							maxWidth: windowWidth * 0.375, //3/8
							marginLeft: windowWidth * 0.0625, // 1/16
					  }
					: { maxWidth: 180, marginHorizontal: 12 }),
			}}
			style={{
				backgroundColor: barColor,
				elevation: 0,
				shadowOpacity: 0,
				shadowColor: 'transparent',
				shadowOffset: { height: 0, width: 0 },
			}}
			TabItemComponent={tabProps => {
				const isDisabled =
					(tabProps.label === 'PEOPLE & POSTS' && activeIndex === 1) ||
					(tabProps.label === 'CHANNELS' && activeIndex === 0);

				return (
					<MaterialTabItem
						{...tabProps}
						labelStyle={{
							lineHeight: isBurmese ? 32 : undefined,
							...((tabProps.labelStyle ?? {}) as object),
						}}
						pressColor="#fff0"
						label={tabProps.label}
						android_ripple={{
							color: '#fff0',
						}}
						disabled={isDisabled}
					/>
				);
			}}
			activeColor={tabBarTextColor}
			labelStyle={{
				fontFamily: 'NewsCycle-Bold',
				textTransform: 'capitalize',
				fontSize: 15,
			}}
			inactiveColor={customColor['patchwork-grey-400']}
		/>
	);
};

export default MaterialTabBarWrapper;
