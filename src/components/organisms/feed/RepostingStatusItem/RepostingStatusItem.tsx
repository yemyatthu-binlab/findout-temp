import StatusContent from '@/components/atoms/feed/StatusContent/StatusContent';
import StatusHeader from '@/components/atoms/feed/StatusHeader/StatusHeader';
import React from 'react';
import { View } from 'react-native';

interface RepostingStatusItemProps {
	status: Patchwork.Status;
}

const RepostingStatusItem: React.FC<RepostingStatusItemProps> = ({
	status,
}) => {
	if (!status?.account) {
		return null;
	}

	return (
		<View className="border flex-1 border-slate-200 dark:border-patchwork-grey-70 my-2 p-3 rounded-xl">
			<StatusHeader status={status} showAvatarIcon isFromQuoteCompose={true} />
			<StatusContent status={status} isReposting isFromQuoteCompose={true} />
		</View>
	);
};

export default RepostingStatusItem;
