import { TFunction } from 'i18next';
import * as yup from 'yup';

export const resetPasswordSchema = (t: TFunction) =>
	yup.object().shape({
		password: yup
			.string()
			.min(6, t('validation.password_min'))
			.required(t('validation.password_required')),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], t('validation.password_must_match'))
			.required(t('validation.password_required')),
	});
