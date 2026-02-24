// import {
// 	INotificationResponse,
// 	NotificationItem,
// } from '@/services/notification.service';

// export const transformNotifications = (
// 	response: INotificationResponse,
// 	notiType: 'all' | 'mentions',
// ): NotificationItem[] => {
// 	const { accounts, notification_groups, statuses } = response;

// 	const accountMap = Object.fromEntries(accounts.map(acc => [acc.id, acc]));

// 	const statusMap = Object.fromEntries(
// 		statuses.map(status => [status.id, status]),
// 	);

// 	if (notiType === 'all') {
// 		return notification_groups
// 			.filter(group => group.type !== 'poll')
// 			.map(group => ({
// 				...group,
// 				account: accountMap[group.sample_account_ids[0]],
// 				status: group.status_id ? statusMap[group.status_id] : null,
// 			}));
// 	} else {
// 		return notification_groups.map(group => ({
// 			...group,
// 			account: accountMap[group.sample_account_ids[0]],
// 			status: group.status_id ? statusMap[group.status_id] : null,
// 		}));
// 	}
// };
