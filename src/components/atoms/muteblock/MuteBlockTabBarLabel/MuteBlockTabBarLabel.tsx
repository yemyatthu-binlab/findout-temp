import { View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { useMuteBlockCountStore } from '@/store/muteblock/muteblockCountStore';

const MuteBlockTabBarLabel = ({
	focused,
	title,
}: {
	focused: boolean;
	title?: string;
}) => {
	const { mutedAccountsCount, blockedAccountsCount } = useMuteBlockCountStore();
	return (
		<ThemeText
			size="md_16"
			className={`font-NewsCycle_Bold ${
				focused
					? 'text-black dark:text-white'
					: 'text-slate-400 dark:text-patchwork-grey-100'
			}`}
		>
			{title} ({title == 'Mute' ? mutedAccountsCount : blockedAccountsCount})
		</ThemeText>
	);
};
export default MuteBlockTabBarLabel;
