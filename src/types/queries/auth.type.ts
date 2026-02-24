export type GetUserQueryParam = {
	id: string;
};

export type LoginMutationPayload = {
	username: string;
	password: string;
};

export type VerifyAuthTokenQueryKey = ['verify-token'];

export type GetUserQueryKey = ['user', GetUserQueryParam];

export type SearchServerInstanceQueryKey = [
	'search-server-instance',
	{ domain: string },
];

export type GetNewsmastAccountlDetailQueryKey = [
	'newsmast-account-detail',
	{ domain_name: string },
];
