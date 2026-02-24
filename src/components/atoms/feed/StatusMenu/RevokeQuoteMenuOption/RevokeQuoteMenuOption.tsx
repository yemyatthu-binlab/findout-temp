import { View } from 'react-native';
import { MenuOption } from 'react-native-popup-menu';
import { QuotePlaceholderIcon } from '@/util/svg/icon.status_actions';
import Toast from 'react-native-toast-message';
import { updateStatusAfterRevokeQuote } from '@/util/cache/feed/feedCache';
import { Flow } from 'react-native-animated-spinkit';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { useRevokeQuoteMutation } from '@/hooks/mutations/statusActions.mutation';
import customColor from '@/util/constant/color';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';

const RevokeQuoteMenuOption = ({
	quotedStatusId,
	quotingStatusId,
}: {
	quotedStatusId: string | undefined;
	quotingStatusId: string;
}) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();

	const { mutate, isPending } = useRevokeQuoteMutation({
		onSuccess: data => {
			if (data) {
				updateStatusAfterRevokeQuote(data);
				Toast.show({
					type: 'success',
					text1: t('quote.quote_removed_success'),
				});
			}
		},
		onError: error => {
			Toast.show({
				type: 'error',
				text1: error.message || t('quote.quote_removed_error'),
			});
		},
	});

	const handleRemove = () => {
		mutate({ quotedStatusId: quotedStatusId!, quotingStatusId });
	};

	return (
		<MenuOption onSelect={handleRemove} disabled={isPending}>
			<View className="flex-row items-center ">
				<View className="w-9 h-9 items-center justify-center">
					<QuotePlaceholderIcon
						colorScheme={colorScheme}
						width={22}
						height={22}
					/>
				</View>
				{isPending ? (
					<Flow
						size={22}
						color={
							colorScheme === 'dark'
								? '#fff'
								: customColor['patchwork-dark-100']
						}
						className="ml-1"
					/>
				) : (
					<ThemeText
						size={'sm_14'}
						className="font-medium ml-1 text-gray-600 dark:text-white flex-1"
					>
						{t('common.remove')}
					</ThemeText>
				)}
			</View>
		</MenuOption>
	);
};

export default RevokeQuoteMenuOption;
