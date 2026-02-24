import { MixedStyleRecord } from 'react-native-render-html';

export const getTagsStyles = ({
	baseTextColor,
	linkColor,
	secondaryTextColor,
}: {
	baseTextColor: string;
	linkColor: string;
	secondaryTextColor: string;
}): MixedStyleRecord => ({
	body: {
		whiteSpace: 'normal' as const,
		color: baseTextColor,
		fontSize: 17,
		lineHeight: 28,
		fontFamily: 'Inter-Regular',
	},
	p: {
		marginBottom: 16,
		marginTop: 0,
	},
	h1: {
		color: baseTextColor,
		fontSize: 32,
		fontFamily: 'NewsCycle-Bold',
		marginBottom: 10,
	},
	h2: {
		color: baseTextColor,
		fontSize: 26,
		fontFamily: 'NewsCycle-Bold',
		marginBottom: 8,
		marginTop: 20,
	},
	h3: {
		color: baseTextColor,
		fontSize: 22,
		fontFamily: 'NewsCycle-Bold',
		marginBottom: 6,
		marginTop: 15,
	},
	a: { color: linkColor, textDecorationLine: 'none' },
	blockquote: {
		borderLeftWidth: 4,
		borderColor: linkColor,
		paddingLeft: 16,
		marginLeft: 0,
		fontStyle: 'italic',
		color: secondaryTextColor,
	},
	ul: { marginLeft: 0, paddingLeft: 20 },
	li: { marginBottom: 8 },
	strong: { fontFamily: 'NewsCycle-Bold' },
});
