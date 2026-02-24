import { TouchableOpacity } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';

export const VisibilityTabButton = ({
	label,
	tab,
	activeTab,
	setActiveTab,
	disabled = false,
}: {
	label: string;
	tab: 'visibility' | 'quote';
	activeTab: 'visibility' | 'quote';
	setActiveTab: (tab: 'visibility' | 'quote') => void;
	disabled?: boolean;
}) => {
	const isActive = activeTab === tab;
	return (
		<TouchableOpacity
			onPress={() => !disabled && setActiveTab(tab)}
			disabled={disabled}
			className={`flex-1 items-center justify-center py-3 border-b-2 ${
				isActive ? 'border-black dark:border-white' : 'border-transparent'
			} ${disabled ? 'opacity-50' : ''}`}
		>
			<ThemeText
				size="md_16"
				className={isActive ? 'font-NewsCycle_Bold' : 'text-gray-500'}
			>
				{label}
			</ThemeText>
		</TouchableOpacity>
	);
};
