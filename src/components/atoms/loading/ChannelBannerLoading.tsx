import customColor from '@/util/constant/color';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ChannelBannerLoading = () => {
	return (
		<View className="w-[100%] relative opacity-20 dark:opacity-100 h-[170] bg-zinc-300 dark:bg-patchwork-grey-70 -z-10" />
	);
};

export default ChannelBannerLoading;
