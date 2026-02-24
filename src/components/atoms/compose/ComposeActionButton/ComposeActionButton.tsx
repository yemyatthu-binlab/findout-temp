import { Pressable, View, ViewProps } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import Popover from 'react-native-popover-view';
import React, { useRef, useState } from 'react';
import customColor from '@/util/constant/color';

type Props = {
	disabled: boolean;
	onPress: () => void;
	extraClassName: string;
	icon: React.ReactNode;
	helperText: string;
};
const ComposeActionButton = ({
	disabled,
	onPress,
	extraClassName,
	icon,
	helperText,
}: Props & ViewProps) => {
	const [helperTextPopover, setHelperTextPopOver] = useState(false);
	const helperTextRef = useRef<View>(null);

	return (
		<View>
			<Pressable
				disabled={disabled}
				ref={helperTextRef}
				onPress={onPress}
				delayLongPress={450}
				onLongPress={() => {
					setHelperTextPopOver(true);
				}}
				className={extraClassName}
				children={icon}
			/>
			<Popover
				isVisible={helperTextPopover}
				from={helperTextRef as React.RefObject<View>}
				onRequestClose={() => setHelperTextPopOver(false)}
				animationConfig={{ duration: 0 }}
				displayAreaInsets={{ top: 0, left: 0, right: 0, bottom: 0 }}
				popoverStyle={{ backgroundColor: customColor['patchwork-dark-50'] }}
			>
				<View className="p-4">
					<ThemeText size={'sm_14'}>{helperText}</ThemeText>
				</View>
			</Popover>
		</View>
	);
};

export default ComposeActionButton;
