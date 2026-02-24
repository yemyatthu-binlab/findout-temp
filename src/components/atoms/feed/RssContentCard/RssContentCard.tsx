/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Pressable, View } from 'react-native';
import ThemeImage from '../../common/ThemeImage/ThemeImage';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { cn } from '@/util/helper/twutil';
import { isTablet } from '@/util/helper/isTablet';

type Props = {
	meta: any;
	extraStyle?: string;
	isFromQuoteCompose?: boolean;
};
const RssContentCard = ({
	meta,
	extraStyle,
	isFromQuoteCompose = false,
}: Props) => {
	const navigation =
		useNavigation<StackNavigationProp<RootStackParamList, 'WebViewer'>>();
	const regex = /(<([^>]+)>)/gi;
	const metaCardTitle = meta?.title?.replace(regex, '');

	const navigateToWebView = (url: string) => {
		navigation.navigate('WebViewer', { url });
	};

	return (
		<View
			className={cn(
				'border border-slate-200 dark:border-gray-800 rounded-lg overflow-hidden',
				extraStyle,
			)}
		>
			<Pressable
				disabled={isFromQuoteCompose}
				onPress={() => navigateToWebView(meta?.url ?? '')}
				className="rounded-xl"
			>
				<ThemeImage
					url={meta?.image}
					imageStyle={{
						height: isTablet ? 330 : 180,
						width: '100%',
						borderTopLeftRadius: 8,
						borderTopRightRadius: 8,
					}}
					blurHash={meta?.blurhash}
				/>

				<View className="p-3">
					<ThemeText size="fs_13">{metaCardTitle || meta?.title}</ThemeText>
					<ThemeText numberOfLines={1} className="mt-1 underline">
						{meta?.url?.split('/')?.slice(0, 3)?.join('/')}
					</ThemeText>
				</View>
			</Pressable>
		</View>
	);
};

export default RssContentCard;
