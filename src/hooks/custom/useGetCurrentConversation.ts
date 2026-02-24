import { queryClient } from '@/App';
import { useActiveConversationActions } from '@/store/conversation/activeConversationStore';
import { PaginatedResponse } from '@/types/queries/conversations.type';
import { useEffect, useState, useMemo } from 'react';
import { useGetConversationsList } from '../queries/conversations.queries';
import { useFeedDetailQuery } from '../queries/feed.queries';

const useGetCurrentConversation = (
	lastMsgId: string,
	isFromExternalNotiAlert: boolean | undefined,
) => {
	if (!lastMsgId) {
		return { currentConversation: undefined, isLoading: false };
	}

	const { saveActiveConversation } = useActiveConversationActions();
	const [currentConversation, setConversation] = useState<
		Patchwork.Conversations | undefined
	>();

	const findConversationInCache = (
		conversationsData: PaginatedResponse<Patchwork.Conversations[]> | undefined,
	) => {
		if (!conversationsData) return undefined;
		return conversationsData.pages
			.flatMap(page => page)
			.find(item => item.last_status?.id === lastMsgId);
	};

	const findConversationById = (
		conversationsData: PaginatedResponse<Patchwork.Conversations[]> | undefined,
		conversationId: string,
	): Patchwork.Conversations | undefined => {
		if (!conversationsData || !conversationId) return undefined;
		return conversationsData.pages
			.flatMap(page => page)
			.find(
				convo =>
					convo.id === conversationId ||
					convo.last_status.id === conversationId,
			);
	};

	const cachedConversationList = queryClient.getQueryData<
		PaginatedResponse<Patchwork.Conversations[]>
	>(['conversations']);
	const initiallyCachedConversation = useMemo(
		() => findConversationInCache(cachedConversationList),
		[cachedConversationList, lastMsgId],
	);

	const { data: fetchedConversationsData, isLoading: isConversationsLoading } =
		useGetConversationsList({
			enabled: !initiallyCachedConversation,
		});

	const { data: statusItemClickedByNoti, isLoading: isStatusLoading } =
		useFeedDetailQuery({
			domain_name: process.env.API_URL ?? '',
			id: lastMsgId,
			options: {
				enabled: !!isFromExternalNotiAlert && !!lastMsgId,
			},
		});

	useEffect(() => {
		let existingConversation: Patchwork.Conversations | undefined;

		if (initiallyCachedConversation) {
			existingConversation = initiallyCachedConversation;
		} else if (fetchedConversationsData) {
			existingConversation = findConversationInCache(fetchedConversationsData);
		}

		if (existingConversation) {
			const conversationToSet = {
				...existingConversation,
				last_status:
					(statusItemClickedByNoti as Patchwork.Status) ||
					existingConversation.last_status,
			};
			setConversation(conversationToSet);
			saveActiveConversation(conversationToSet);
		} else if (statusItemClickedByNoti) {
			const status = statusItemClickedByNoti as Patchwork.Status;
			const syntheticConversation: Patchwork.Conversations = {
				id: (status as any).conversation?.id || lastMsgId,
				unread: true,
				last_status: status,
				accounts: [status.account],
			};

			setConversation(syntheticConversation);
			saveActiveConversation(syntheticConversation);
		}
	}, [
		lastMsgId,
		initiallyCachedConversation,
		fetchedConversationsData,
		statusItemClickedByNoti,
		saveActiveConversation,
	]);

	const isLoading =
		(isFromExternalNotiAlert && isStatusLoading) ||
		(!initiallyCachedConversation && isConversationsLoading);

	const isWaitingForConversation = !currentConversation && isLoading;

	return {
		currentConversation,
		isLoading: isWaitingForConversation,
	};
};

export default useGetCurrentConversation;
