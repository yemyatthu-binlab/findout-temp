const styles = {
	tabItem: (isActiveTab: boolean) => {
		return /* tw */ `flex flex-1 rounded-lg items-center p-3 ${
			isActiveTab
				? 'bg-patchwork-light-900'
				: 'bg-patchwork-light-50 dark:bg-patchwork-dark-50'
		}`;
	},

	tabItemText: (isActiveTab: boolean) => {
		return /* tw */ `test-base ${
			isActiveTab
				? 'text-patchwork-dark-900'
				: 'text-patchwork-dark-900 dark:text-patchwork-light-900'
		}`;
	},
};

export default styles;
