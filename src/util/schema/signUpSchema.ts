import { TFunction } from 'i18next';
import * as yup from 'yup';

export const getSignUpSchema = (t: TFunction) =>
	yup.object().shape({
		email: yup
			.string()
			.email(t('validation.invalid_email'))
			.required(t('validation.email_required')),

		username: yup
			.string()
			.matches(/^[a-zA-Z0-9_]+$/, t('validation.username_pattern'))
			.min(3, t('validation.username_min'))
			.max(20, t('validation.username_max'))
			.required(t('validation.username_required')),

		createPassword: yup
			.string()
			.min(6, t('validation.password_min'))
			.required(t('validation.password_required')),

		repeatPassword: yup
			.string()
			.oneOf([yup.ref('createPassword')], t('validation.passwords_must_match'))
			.required(t('validation.confirm_password_required')),
	});

export type SignUpFormType = yup.InferType<ReturnType<typeof getSignUpSchema>>;
