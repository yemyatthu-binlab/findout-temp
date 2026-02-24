import { Asset } from 'react-native-image-picker';
import { string } from 'yup';

export type AccountInfoQueryParam = {
	id: string;
	domain_name: string;
};

export type CheckRelationshipQueryParam = {
	accountIds: string[];
};

export type SpecificServerProfileQueryParam = {
	q: string;
	type?: 'accounts' | 'statuses';
};

export type AccountInfoQueryKey = ['get_account_info', AccountInfoQueryParam];

export type CheckRelationshipQueryKey = [
	'check-relationship-to-other-accounts',
	CheckRelationshipQueryParam,
];

export type SpecificServerProfileQueryKey = [
	'specify-server-profile',
	SpecificServerProfileQueryParam,
];

export type FollowingAccountsQueryKey = [
	'following-accounts',
	{
		accountId: Patchwork.Account['id'];
		domain_name: string;
	},
];

export type FollowerAccountsQueryKey = [
	'follower-accounts',
	{
		accountId: Patchwork.Account['id'];
		domain_name: string;
	},
];

export type UpdateProfilePayload = {
	display_name?: string;
	note?: string;
	avatar?: string | Asset;
	header?: string | Asset;
	locked?: boolean;
	bot?: boolean;
	discoverable?: boolean;
	hide_collections?: boolean;
	indexable?: boolean;
	fields_attributes?: { name: string; value: string }[];
	source?: {
		privacy: string;
		sensitive: boolean;
		language: string;
	};
};

export type GetSuggestedPeopleQueryKey = [
	'suggested-people',
	{ limit: number },
];
