import {
	InfiniteData,
	UseInfiniteQueryOptions,
	UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AccessibilityInfo, LayoutAnimation } from 'react-native';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type PagedResponse<T = unknown> = {
	data: T;
	links?: {
		prev?: { min_id: string };
		next?: { max_id: string };
	};
};

export const infinitePageParam = {
	getPreviousPageParam: (firstPage: PagedResponse<any>) =>
		firstPage.links?.prev?.min_id,
	getNextPageParam: (lastPage: PagedResponse<any>) => {
		return lastPage.links?.next?.max_id;
	},
};

export const flattenPages = <T>(
	data: InfiniteData<PagedResponse<T[]>> | undefined,
): T[] | [] => {
	if (Array.isArray(data?.pages)) {
		return data?.pages.flatMap(page => page.data) || [];
	}
	return [];
};

export const layoutAnimation = async () => {
	const disable = await AccessibilityInfo.isReduceMotionEnabled();
	if (disable) return;

	LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};
