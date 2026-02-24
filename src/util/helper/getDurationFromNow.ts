import moment from 'moment';
import { handleError } from './helper';
import { useTranslation } from 'react-i18next';

export function getDurationFromNow(timestamp: string): string {
	const { t } = useTranslation();
	const now = moment();
	let givenTime = moment(timestamp);

	if (!givenTime.isValid()) {
		handleError('Invalid timestamp format');
	}

	let diffInSeconds = now.diff(givenTime, 'seconds');

	// Note: Added an extra sec to future timestamp to align with query cache updates
	if (givenTime.isAfter(now)) {
		const adjustedTime = givenTime.add(1, 'seconds');
		diffInSeconds = adjustedTime.diff(now, 'seconds');
	}

	if (diffInSeconds < 60) {
		return t('conversation.time_stamp.just_now');
	} else if (diffInSeconds < 3600) {
		const diffInMinutes = now.diff(givenTime, 'minutes');
		return t('conversation.time_stamp.duration_minutes', {
			count: diffInMinutes,
			defaultValue: '{{count}}m',
		});
	} else if (diffInSeconds < 86400) {
		const diffInHours = now.diff(givenTime, 'hours');
		return t('conversation.time_stamp.duration_hours', {
			count: diffInHours,
			defaultValue: '{{count}}h',
		});
	} else {
		const diffInDays = now.diff(givenTime, 'days');
		return t('conversation.time_stamp.duration_days', {
			count: diffInDays,
			defaultValue: '{{count}}d',
		});
	}
}
