import { TFunction } from 'i18next';
import * as yup from 'yup';

export const getUpdatePasswordSchema = (t: TFunction) =>
	yup.object({
		currentPassword: yup
			.string()
			.required(t('validation.current_password_required'))
			.min(6, t('validation.current_password_min')),
		newPassword: yup
			.string()
			.required(t('validation.new_password_required'))
			.min(6, t('validation.new_password_min'))
			.notOneOf(
				[yup.ref('currentPassword')],
				t('validation.new_password_same_as_current'),
			),
		repeatNewPassword: yup
			.string()
			.required(t('validation.confirm_new_password_required'))
			.oneOf([yup.ref('newPassword')], t('validation.passwords_must_match')),
	});
