import { useColorScheme } from 'nativewind';
import {
	ComposeGlobeIcon,
	ComposeLockIcon,
	ComposeMentionIcon,
	ComposeUnlockIcon,
} from '../svg/icon.compose';

export const getVisibilityIcons = (colorScheme: 'light' | 'dark') =>
	({
		public: <ComposeGlobeIcon width={12} colorScheme={colorScheme} />,
		unlisted: <ComposeUnlockIcon width={12} colorScheme={colorScheme} />,
		private: <ComposeLockIcon width={12} colorScheme={colorScheme} />,
		direct: <ComposeMentionIcon width={12} colorScheme={colorScheme} />,
	} satisfies Record<Patchwork.Status['visibility'], React.ReactNode>);

export const visibilityMessages: Record<
	Patchwork.Status['visibility'],
	string
> = {
	public: 'Anyone',
	unlisted: 'Anyone, but not listed in timelines',
	private: 'Followers only',
	direct: 'Private mention',
};
