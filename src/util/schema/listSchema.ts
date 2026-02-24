import { t } from 'i18next';
import * as yup from 'yup';

export const listFormSchema = yup.object().shape({
	title: yup.string().required(t('list.schema.name_of_list_required')),
	replies_policy: yup
		.mixed<'followed' | 'list' | 'none'>()
		.oneOf(
			['followed', 'list', 'none'],
			t('list.schema.replies_policy_invalid'),
		)
		.required(t('list.schema.replies_policy_required')),
	exclusive: yup.boolean().required(t('list.schema.exclusive_required')),
});

export type ListsFormValues = yup.InferType<typeof listFormSchema>;
