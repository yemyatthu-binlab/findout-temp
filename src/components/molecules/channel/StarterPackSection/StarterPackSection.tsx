import StarterPackSectionItem from '@/components/atoms/channel/StarterPackSectionItem/StarterPackSectionItem';
import HorizontalItemRenderer from '@/components/atoms/common/HorizontalItemRenderer/HorizontalItemRenderer';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import ChannelLoading from '@/components/atoms/loading/ChannelLoading';
import { useStarterPackList } from '@/hooks/queries/channel.queries';
import { cn } from '@/util/helper/twutil';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';

const StarterPackSection = () => {
	const { t } = useTranslation();
	const { data: starterPackList } = useStarterPackList();

	if (starterPackList?.length === 0) {
		return null;
	}

	return (
		<View>
			<View className="flex-row items-center px-4">
				<ThemeText className="font-NewsCycle_Bold my-2 flex-1" size="lg_18">
					{t('timeline.starter_pack')}
				</ThemeText>
			</View>
			{starterPackList ? (
				<HorizontalItemRenderer
					data={starterPackList}
					renderItem={(item, idx) => (
						<StarterPackSectionItem item={item} index={idx!} />
					)}
				/>
			) : (
				<View className="ml-4 -mt-8">
					<ChannelLoading
						title=""
						cardCount={3}
						customHeight={150}
						customWidth={300}
					/>
				</View>
			)}
		</View>
	);
};
export default StarterPackSection;
