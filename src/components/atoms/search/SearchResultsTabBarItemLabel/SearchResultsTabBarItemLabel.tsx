import React from 'react';
import { Route } from 'react-native-tab-view';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';

type SearchResultsTabBarItemLabelProps = {
	route: Route;
	focused: boolean;
};

const SearchResultsTabBarItemLabel = ({
	route,
	focused,
}: SearchResultsTabBarItemLabelProps) => {
	return (
		<ThemeText
			className={`mx-1 tracking-wide font-NewsCycle_Bold ${
				focused
					? 'text-patchwork-primary dark:text-patchwork-primary-dark'
					: 'text-slate-400 dark:text-patchwork-grey-100'
			}`}
		>
			{route.title}
		</ThemeText>
	);
};

export default SearchResultsTabBarItemLabel;
