import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { ThemeValue } from '@/util/helper/helper';
import { cn } from '@/util/helper/twutil';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

export type ThemePreference = ThemeValue | undefined;

export const ThemeButton = ({
	label,
	preference,
	activePreference,
	onPress,
	extraClassName,
	systemTheme,
}: {
	label: string;
	preference: ThemePreference;
	activePreference: ThemePreference;
	onPress: () => void;
	extraClassName: string;
	systemTheme: ThemeValue;
}) => {
	const { t } = useTranslation();
	const isActive = preference === activePreference;

	let activeTextColor = '';
	if (isActive) {
		if (preference === 'light') {
			activeTextColor = 'text-white';
		} else if (preference === 'dark') {
			activeTextColor = 'text-white';
		} else {
			activeTextColor = systemTheme === 'light' ? 'text-white' : 'text-black';
		}
	}

	return (
		<Pressable
			className={cn(
				'border flex-1 border-slate-200 dark:border-gray-600 p-3',
				isActive && 'bg-patchwork-primary dark:bg-patchwork-primary-dark',
				extraClassName,
			)}
			onPress={onPress}
		>
			<ThemeText className={cn('text-center', activeTextColor)}>
				{t(label)}
			</ThemeText>
		</Pressable>
	);
};
