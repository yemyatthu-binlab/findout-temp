import * as yup from 'yup';

export const keywordSchema = yup.object().shape({
	keyword: yup.string().required("Keyword can't be empty"),
});

export const filterOutKeyworkdSchema = yup.object().shape({
	keyword: yup.string().required("Keyword can't be empty"),
	isHashtag: yup.boolean().default(false),
});
