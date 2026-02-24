import React, { memo } from 'react';
import { View } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { formatTimeLeft } from '@/util/helper/pollCalculation';
import { RefreshIcon } from '@/util/svg/icon.status_actions';
import { Button } from '@/components/atoms/common/Button/Button';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

interface PollVotingFooterProps {
	votesCount: number;
	votersCount: number;
	isMultiple: boolean;
	expired: boolean;
	expiresAt: string | null;
	isRefreshing: boolean;
	onRefresh: () => void;
	isFromNoti?: boolean;
	showResult?: boolean;
}
const PollVotingFooter = ({
	votesCount,
	votersCount,
	isMultiple,
	expired,
	expiresAt,
	isRefreshing,
	onRefresh,
	isFromNoti,
	showResult,
}: PollVotingFooterProps) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const displayVotes =
		votesCount === 1 ? `${votesCount} vote` : `${votesCount} votes`;

	const displayVoters =
		votersCount === 1 ? `${votersCount} voter` : `${votersCount} voters`;

	return (
		<View className="mb-1 mt-3 flex-row items-center">
			{isMultiple ? (
				<ThemeText className="opacity-80">{`${displayVotes} from ${displayVoters}`}</ThemeText>
			) : (
				<ThemeText className="opacity-80">{displayVotes}</ThemeText>
			)}
			<ThemeText className="mx-2 opacity-80">▸</ThemeText>
			<ThemeText className="opacity-80">
				{expired ? 'Closed' : `${formatTimeLeft(expiresAt)}`}
			</ThemeText>
			{!isFromNoti && showResult && (
				<Button
					className="flex-row items-center justify-center absolute right-0 px-2 py-0 min-w-24"
					variant="outline"
					size="sm"
					onPress={onRefresh}
					disabled={isRefreshing}
				>
					<ThemeText size={'xs_12'} className="mr-1 text-left">
						{isRefreshing ? t('poll.refreshing') : t('poll.refresh')}
					</ThemeText>
					{!isRefreshing && (
						<RefreshIcon fill={colorScheme === 'dark' ? '#fff' : '#000'} />
					)}
				</Button>
			)}
		</View>
	);
};

export default memo(PollVotingFooter);
