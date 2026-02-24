import { TFunction } from 'i18next';
import * as yup from 'yup';

export const forgetPWSchema = (t: TFunction) =>
	yup.object().shape({
		email: yup
			.string()
			.email(t('validation.invalid_email'))
			.required(t('validation.email_required')),
	});
