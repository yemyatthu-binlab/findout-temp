import { t } from 'i18next';

export const REPLIES_POLICY = [
	{ label: t('list.any_followed_user'), value: 'followed' },
	{ label: t('list.members_of_the_list'), value: 'list' },
	{ label: t('list.no_one'), value: 'none' },
] as const;
