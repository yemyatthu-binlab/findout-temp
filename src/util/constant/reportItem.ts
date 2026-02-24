export type ReportItem = {
	category: string;
	title: string;
	desc: string;
};
export const reportContentData: ReportItem[] = [
	{
		category: 'spam',
		title: "It's spam",
		desc: 'Malicious links, fake engagement, or repetitive replies',
	},
	{
		category: 'legal',
		title: "It's illegal",
		desc: "You believe it violates the law of your or the server's country",
	},
	{
		category: 'violation',
		title: 'It violates server rules',
		desc: 'You are aware that it breaks specific rules',
	},
	{
		category: 'other',
		title: "It's something else",
		desc: 'The issue does not fit into other categories',
	},
];

export type ViolationItem = {
	value: string;
	text: string;
};
export const violationData: ViolationItem[] = [
	{
		value: '1',
		text: 'Sexually explicit or violent media must be marked as sensitive when posting',
	},
	{
		value: '2',
		text: 'No racism, sexism, homophobia, transphobia, xenophobia, or casteism',
	},
	{
		value: '3',
		text: 'No incitement of violence or promotion of violent ideologies',
	},
	{
		value: '4',
		text: 'No harassment, dogpiling or doxxing of other users',
	},
	{
		value: '5',
		text: 'Do not share intentionally false or misleading information',
	},
];
