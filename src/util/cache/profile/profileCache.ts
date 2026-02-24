import { queryClient } from '@/App';
import { AccountInfoQueryKey } from '@/types/queries/profile.type';
import { cleanText } from '@/util/helper/cleanText';
import { getFullSocialLink } from '@/util/helper/socialLink';

export const removeSocialLink = (
	acctInfoQueryKey: AccountInfoQueryKey,
	socialMediaName: string,
) => {
	queryClient.setQueryData<Patchwork.Account>(acctInfoQueryKey, oldData => {
		if (!oldData) return oldData;

		return {
			...oldData,
			fields: oldData?.fields.map(field =>
				field.name == socialMediaName ? { ...field, value: '' } : field,
			),
		};
	});
};

export const addSocialLink = (
	acctInfoQueryKey: AccountInfoQueryKey,
	socialMediaName: string,
	socialMediaUsername: string,
) => {
	queryClient.setQueryData<Patchwork.Account>(acctInfoQueryKey, oldData => {
		if (!oldData) return oldData;

		const targetName = socialMediaName.trim();
		const usernameAfterRemovingHTMLTags = cleanText(socialMediaUsername);
		const fullURL = getFullSocialLink(
			targetName,
			usernameAfterRemovingHTMLTags,
		);

		const updatedFields = oldData.fields.some(
			field => field.name.trim() === targetName,
		)
			? oldData.fields.map(field =>
					field.name.trim() === targetName
						? { ...field, value: fullURL }
						: field,
			  )
			: [...oldData.fields, { name: socialMediaName, value: fullURL }];

		return {
			...oldData,
			fields: updatedFields,
		};
	});
};
