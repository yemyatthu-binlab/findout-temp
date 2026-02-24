import {
	HTMLContentModel,
	HTMLElementModel,
	MixedStyleRecord,
} from 'react-native-render-html';
import colors from 'tailwindcss/colors';

interface GetWpStoryStylesProps {
	isDark: boolean;
	isTablet: boolean;
	textColor: string;
}

export const getBaseStyle = ({
	isTablet,
	textColor,
}: {
	isTablet: boolean;
	textColor: string;
}) => ({
	fontFamily: 'Inter-Regular',
	color: textColor,
	fontSize: isTablet ? 19 : 17,
	lineHeight: isTablet ? 30 : 28,
});

export const getTagsStyles = ({
	isDark,
	isTablet,
	textColor,
}: GetWpStoryStylesProps): MixedStyleRecord => ({
	a: {
		color: isDark ? 'white' : 'black',
		textDecorationLine: 'underline',
		textDecorationColor: isDark ? 'white' : 'black',
		fontWeight: '600',
		fontFamily: 'Inter-Regular',
	},
	h1: {
		color: textColor,
		fontSize: isTablet ? 38 : 32,
		fontWeight: 'bold',
		marginBottom: 10,
		fontFamily: 'NewsCycle-Bold',
	},
	h2: {
		color: textColor,
		fontSize: isTablet ? 30 : 26,
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 8,
		fontFamily: 'NewsCycle-Bold',
	},
	h3: {
		color: textColor,
		fontSize: isTablet ? 26 : 22,
		fontWeight: 'bold',
		marginTop: 15,
		marginBottom: 6,
		fontFamily: 'Inter-Regular',
	},
	h4: {
		color: textColor,
		fontSize: isTablet ? 19 : 17,
		lineHeight: isTablet ? 30 : 28,
		marginBottom: 20,
		fontFamily: 'Inter-Regular',
	},
	p: {
		color: textColor,
		fontSize: isTablet ? 19 : 17,
		lineHeight: isTablet ? 30 : 28,
		marginBottom: 20,
		fontFamily: 'Inter-Regular',
	},
	cite: {
		fontSize: 14,
		color: isDark ? colors['gray'][400] : colors['gray'][800],
		fontFamily: 'NewsCycle-Bold',
		fontStyle: 'normal',
		textAlign: 'left',
		marginTop: 8,
	},
	figcaption: {
		fontSize: 11,
		textAlign: 'center',
		lineHeight: 15,
		marginTop: 6,
		fontFamily: 'NewsCycle-Bold',
	},
	li: {
		color: textColor,
		fontSize: isTablet ? 19 : 17,
		lineHeight: isTablet ? 30 : 28,
		marginBottom: 10,
		fontFamily: 'Inter-Regular',
	},
});

export const customHTMLElementModels = {
	iframe: HTMLElementModel.fromCustomModel({
		tagName: 'iframe',
		mixedUAStyles: {
			height: '200px',
			width: '100%',
		},
		contentModel: HTMLContentModel.block,
	}),
};
