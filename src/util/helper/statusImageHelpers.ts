import { isTablet } from './isTablet';

export const statusImageFullHeight = isTablet ? 400 : 232;
export const statusImageHalfHeight = (isTablet ? 400 : 232) / 2 - 2;
export const statusImagePortraitSingleHeight = isTablet ? 400 * 1.9 : 232 * 1.6;

export const isSinglePortraitImage = (attachments: Patchwork.Attachment[]) =>
	attachments?.length === 1 &&
	attachments[0]?.meta?.original?.width! <
		attachments[0]?.meta?.original?.height!;

export const calculateHeightForBlurHash = (
	length: number,
	index: number,
	isPortrait: boolean,
): number => {
	if (length === 1 && isPortrait) return statusImagePortraitSingleHeight;
	if (length === 3 && index === 0) return statusImageFullHeight;
	if (length === 3 && (index === 1 || index === 2))
		return statusImageHalfHeight;
	return length > 2 ? statusImageHalfHeight : statusImageFullHeight;
};
