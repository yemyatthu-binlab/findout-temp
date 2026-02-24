import { TFunction } from 'i18next';

export type VisibilitySettingsProps = {
	label: string;
	icon: Patchwork.ComposeVisibility;
};

export type SettingsItemProps = VisibilitySettingsProps & {
	value?: string;
	description?: string;
};

export const getVisibilitySettingsData = (t: TFunction) => {
	return [
		{ label: t('timeline.visibility.public'), icon: 'public' },
		// { label: t('timeline.visibility.unlisted'), icon: 'unlisted' },
		{ label: t('timeline.visibility.private'), icon: 'private' },
		{ label: t('timeline.visibility.local_only'), icon: 'local' },
	];
};

export const getQuoteSettingsData = (t: TFunction): SettingsItemProps[] => {
	return [
		{
			label: t('timeline.visibility.public', 'Anyone'),
			value: 'public',
			icon: 'public',
		},
		{
			label: t('timeline.visibility.followers_only', 'Followers only'),
			value: 'followers',
			icon: 'unlisted',
		},
		{
			label: t('timeline.visibility.just_me', 'Just me'),
			value: 'nobody',
			icon: 'private',
		},
	];
};
