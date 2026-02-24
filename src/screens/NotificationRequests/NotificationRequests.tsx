import React, { useMemo } from 'react';
import { FlatList } from 'react-native';

import BackButton from '@/components/atoms/common/BackButton/BackButton';
import Header from '@/components/atoms/common/Header/Header';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import {
	useAcceptNotiReqMutation,
	useDismissNotiReqMutation,
} from '@/hooks/mutations/conversations.mutation';
import {
	removeAcceptedNotiReq,
	removeDismissedNotiReq,
} from '@/util/cache/conversation/conversationCahce';
import NotiReqItem from '@/components/molecules/conversations/NotiReqItem/NotiReqItem';
import { EmptyMsgReqItem } from '@/components/molecules/conversations/EmptyMsgReqItem/EmptyMsgReqItem';
import { queryClient } from '@/App';
import { useTranslation } from 'react-i18next';

const NofificationRequests = () => {
	const { t } = useTranslation();
	const data: Patchwork.NotiReq[] | undefined = queryClient.getQueryData([
		'all-noti-req',
	]);
	const notiReqList = useMemo(() => data?.flat() || [], [data]);

	// mutation
	const { mutate: acceptNotiReq } = useAcceptNotiReqMutation({
		onSuccess: (_, { id }) => {
			removeAcceptedNotiReq(id);
			queryClient.invalidateQueries({
				queryKey: ['conversations'],
				exact: true,
			});
		},
	});
	const { mutate: dismissNotiReq } = useDismissNotiReqMutation({
		onSuccess: (_, { id }) => removeDismissedNotiReq(id),
	});

	return (
		<SafeScreen>
			<Header
				title={t('screen.message_requests')}
				leftCustomComponent={<BackButton />}
			/>
			<FlatList
				data={notiReqList}
				keyExtractor={item => item.id}
				renderItem={({ item }: { item: Patchwork.NotiReq }) => (
					<NotiReqItem
						item={item}
						onPressCancel={id => dismissNotiReq({ id })}
						onPressAccept={id => acceptNotiReq({ id })}
					/>
				)}
				ListEmptyComponent={EmptyMsgReqItem}
				showsVerticalScrollIndicator={false}
			/>
		</SafeScreen>
	);
};

export default NofificationRequests;
