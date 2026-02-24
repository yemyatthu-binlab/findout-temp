interface CacheUpdateParams<TResponse, TQueryKeys> {
	response: TResponse;
	queryKeys: TQueryKeys[];
}
interface IFeedQueryFnData {
	pageParams: unknown[];
	pages: Array<{
		data: Patchwork.Status[];
	}>;
}

interface IFeedDetailQueryFnData extends Patchwork.Status {}
