import { TFunction } from 'i18next';
import * as yup from 'yup';

export const getEmailUpdateSchema = (t: TFunction) =>
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
