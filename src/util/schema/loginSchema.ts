import * as yup from 'yup';
import { TFunction } from 'i18next';

export const getLoginSchema = (t: TFunction) =>
	yup.object().shape({
		email: yup
			.string()
			.email(t('validation.invalid_email'))
			.required(t('validation.email_required')),

		password: yup
			.string()
			.min(6, t('validation.password_min'))
			.required(t('validation.password_required')),
	});
