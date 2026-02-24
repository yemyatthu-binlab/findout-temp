import RebloggedStatus from '../RebloggedStatus/RebloggedStatus';
import StatusItem from '../StatusItem/StatusItem';
import ReplyStatus from '../ReplyStatus/ReplyStatus';
import FeedDetailStatus from '@/components/atoms/feed/FeedDetailStatus/FeedDetailStatus';
import {
	StatusCurrentPage,
	StatusOrigin,
	StatusType,
} from '@/context/statusItemContext/statusItemContext.type';
import { StatusContextProvider } from '@/context/statusItemContext/statusItemContext';
import NotificationStatus from '../NotificationStatus/NotificationStatus';
import RepostingStatusItem from '../RepostingStatusItem/RepostingStatusItem';
import ChannelFeedStatus from '../ChannelFeedStatus/ChannelFeedStatus';
import { useStatus } from '@/hooks/custom/useStatus';
import { useActiveDomainStore } from '@/store/feed/activeDomain';
import QuotePlaceholder from '@/components/molecules/feed/QuotePlaceholder/QuotePlaceholder';

type DefaultStatusProps = {
	status: Patchwork.Status;
	currentPage: StatusCurrentPage;
	comeFrom?: StatusOrigin;
	extraPayload?: Record<string, any> | undefined;
};

type NormalStatusProps = DefaultStatusProps & {
	statusType: Exclude<StatusType, 'reply'>;
};

type ReplyStatusProps = DefaultStatusProps & {
	statusType: 'reply';
	feedDetailId: string;
	nextStatus: Patchwork.Status | undefined;
	isNestedNodeInclude: boolean | undefined;
	isAncenstorNode?: boolean;
};

type StatusWrapperProps = NormalStatusProps | ReplyStatusProps;

export const StatusWrapper = (props: StatusWrapperProps) => {
	const {
		status: originalStatus,
		comeFrom,
		currentPage,
		statusType,
		extraPayload,
	} = props;
	const { domain_name } = useActiveDomainStore();
	const { data: cacheStatus } = useStatus(
		originalStatus.reblog ? originalStatus.reblog.id : originalStatus.id,
		domain_name,
		originalStatus.reblog ? originalStatus.reblog : originalStatus,
	);

	if (
		cacheStatus?.isDeleted ||
		cacheStatus?.isMuted ||
		cacheStatus?.isBlocked ||
		cacheStatus?.custom?.forceHideStatus ||
		(Array.isArray(originalStatus?.filtered) &&
			originalStatus.filtered.some(f => f.filter?.filter_action === 'hide'))
	) {
		return <></>;
	}

	const quote = cacheStatus?.quote;
	const quoteState = quote?.state;
	const quoteStatesWithStatus = ['accepted'];

	if (
		quote &&
		(!quoteState ||
			!quoteStatesWithStatus.includes(quoteState) ||
			!quote.quoted_status)
	) {
		return (
			<StatusContextProvider
				value={{
					parentStatus: cacheStatus!,
					comeFrom: comeFrom || 'other',
					currentPage,
					statusType,
					extraPayload,
				}}
			>
				<QuotePlaceholder
					state={quoteState}
					status={cacheStatus}
					isFromNoti={comeFrom === 'noti'}
					isFeedDetail={currentPage === 'FeedDetail'}
					isFromCompose={
						statusType === 'quoting' || statusType === 'notification'
					}
				/>
			</StatusContextProvider>
		);
	}

	const renderStatusComponent = () => {
		switch (statusType) {
			case 'reply': {
				const {
					feedDetailId,
					nextStatus,
					isNestedNodeInclude,
					isAncenstorNode,
				} = props;
				return (
					<ReplyStatus
						{...{
							status: cacheStatus!,
							feedDetailId,
							nextStatus,
							isNestedNodeInclude,
							isAncenstorNode,
						}}
					/>
				);
			}

			case 'reblog':
				return (
					<RebloggedStatus
						status={originalStatus}
						reblogStatus={cacheStatus!}
						isFromNoti={comeFrom == 'noti'}
					/>
				);

			case 'feedDetail':
				return <FeedDetailStatus feedDetail={cacheStatus!} />;

			case 'notification':
				return <NotificationStatus status={cacheStatus!} />;

			case 'quoting':
				return <RepostingStatusItem status={cacheStatus!} />;

			case 'channel-feed':
				return (
					<ChannelFeedStatus
						status={cacheStatus!}
						isFromNoti={comeFrom == 'noti'}
					/>
				);

			case 'normal':
				return (
					<StatusItem status={cacheStatus!} isFromNoti={comeFrom == 'noti'} />
				);

			default:
				return <></>;
		}
	};
	return (
		<StatusContextProvider
			value={{
				parentStatus: cacheStatus!,
				comeFrom: comeFrom || 'other',
				currentPage,
				statusType,
				extraPayload,
			}}
		>
			{renderStatusComponent()}
		</StatusContextProvider>
	);
};

export default StatusWrapper;
