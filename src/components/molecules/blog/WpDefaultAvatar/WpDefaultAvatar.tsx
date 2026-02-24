import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

interface InitialAvatarProps {
	name: string;
	className?: string;
	backgroundColor: string;
	textColor: string;
	size?: number;
	style?: StyleProp<ViewStyle>;
}

const getInitials = (name: string): string => {
	if (!name || typeof name !== 'string') return '??';

	const parts = name.trim().split(' ').filter(Boolean);

	if (parts.length === 0) return '??';
	if (parts.length === 1) {
		return parts[0].substring(0, 2).toUpperCase();
	}
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const WpDefaultAvatar = ({
	name,
	className,
	backgroundColor,
	textColor,
	size,
	style,
}: InitialAvatarProps) => {
	const initials = getInitials(name);

	const fontSize = size ? Math.floor(size / 2.5) : 16;

	return (
		<StyledView
			className={`items-center justify-center rounded-full ${className ?? ''}`}
			style={[
				{
					backgroundColor: backgroundColor,
					...(size ? { width: size, height: size } : {}),
				},
				style,
			]}
		>
			<StyledText
				className="font-NewsCycle_Bold"
				style={{
					color: textColor,
					fontSize: fontSize,
				}}
			>
				{initials}
			</StyledText>
		</StyledView>
	);
};

export default WpDefaultAvatar;
