import { View, FlatList } from 'react-native';
import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import { useViewMultiDraft } from '@/hooks/queries/feed.queries';
import { Flow } from 'react-native-animated-spinkit';
import customColor from '@/util/constant/color';
import ListEmptyComponent from '@/components/atoms/common/ListEmptyComponent/ListEmptyComponent';
import Underline from '@/components/atoms/common/Underline/Underline';
import { useAuthStore } from '@/store/auth/authStore';
import {
	CHANNEL_INSTANCE,
	DEFAULT_INSTANCE,
	MO_ME_INSTANCE,
	NEWSMAST_INSTANCE_V1,
} from '@/util/constant';
import DraftPostItem from '@/components/atoms/compose/DraftPostItem/DraftPostItem';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

interface Props {
	visible: boolean;
	onClose: () => void;
}

const DraftPostsModal = ({ visible, onClose }: Props) => {
	const { t } = useTranslation();
	const { colorScheme } = useColorScheme();
	const { userOriginInstance } = useAuthStore();

	const { data: multiDraftStatuses, isLoading } = useViewMultiDraft({
		enabled: [
			DEFAULT_INSTANCE,
			MO_ME_INSTANCE,
			NEWSMAST_INSTANCE_V1,
			CHANNEL_INSTANCE,
		].includes(userOriginInstance),
	});

	return (
		<ThemeModal
			visible={visible}
			onClose={onClose}
			type="default"
			position="normal"
			title={t('compose.drafts')}
		>
			{isLoading ? (
				<View className="flex-1 items-center justify-center">
					<Flow
						size={50}
						color={
							colorScheme === 'dark'
								? customColor['patchwork-primary-dark']
								: customColor['patchwork-primary']
						}
					/>
				</View>
			) : (
				<FlatList
					data={multiDraftStatuses}
					keyExtractor={(_, index) => index.toString()}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={Underline}
					renderItem={({ item }) => (
						<>
							{item.datas.map((i, index) => (
								<DraftPostItem
									key={i.id}
									item={i}
									index={index}
									date={item.date}
									onClose={onClose}
								/>
							))}
						</>
					)}
					ListEmptyComponent={
						<ListEmptyComponent title={t('compose.draft.no_drafts_desc')} />
					}
				/>
			)}
		</ThemeModal>
	);
};

export default DraftPostsModal;
