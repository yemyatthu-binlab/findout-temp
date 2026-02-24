export const POLL_DURATION_OPTIONS = [
	{ label: '5 minutes', value: 300 },
	{ label: '30 minutes', value: 1800 },
	{ label: '1 hour', value: 3600 },
	{ label: '6 hours', value: 21600 },
	{ label: '1 day', value: 86400 },
	{ label: '3 days', value: 259200 },
	{ label: '7 days', value: 604800 },
] as const;

export const POLL_LIMITS = {
	MIN_OPTIONS: 2,
	MAX_OPTIONS: 4,
	MAX_OPTION_TEXT_LENGTH: 50,
} as const;

export const POLL_TYPES = [
	{ label: 'Single choice', value: false },
	{ label: 'Multiple choice', value: true },
] as const;

export const POLL_INITIAL = {
	options: ['', ''],
	expires_in: POLL_DURATION_OPTIONS['4']['value'],
	multiple: POLL_TYPES['0']['value'],
};
