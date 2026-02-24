import { useManageAttachmentStore } from '@/store/compose/manageAttachments/manageAttachmentStore';
import customColor from '@/util/constant/color';
import { useColorScheme } from 'nativewind';
import * as Progress from 'react-native-progress';

const ImageProgressBar = ({ size = 50 }: { size?: number }) => {
	const { colorScheme } = useColorScheme();
	const progressInfo = useManageAttachmentStore(state => state.progress);

	return (
		<Progress.Circle
			progress={progressInfo?.progress! / 100}
			size={size}
			color={
				colorScheme === 'dark'
					? customColor['patchwork-primary-dark']
					: customColor['patchwork-primary']
			}
		/>
	);
};
export default ImageProgressBar;
