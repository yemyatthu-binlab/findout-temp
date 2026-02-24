import * as yup from 'yup';

export const hashtagSchema = yup.object().shape({
	hashtag: yup
		.string()
		.required("Hashtag can't be empty")
		.matches(
			/^[a-zA-Z0-9_]+$/,
			'Hashtag must contain only alphanumeric characters and underscores',
		),
});
