import { useEffect, useRef, useState } from 'react';
import { Animated, View, LayoutChangeEvent } from 'react-native';

export const AccordionContent: React.FC<{
	isOpen: boolean;
	children: React.ReactNode;
}> = ({ isOpen, children }) => {
	const [contentHeight, setContentHeight] = useState(0);
	const animatedHeight = useRef(new Animated.Value(0)).current;
	const isMounted = useRef(true);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (contentHeight === 0) return;

		Animated.timing(animatedHeight, {
			toValue: isOpen ? contentHeight : 0,
			duration: 250,
			useNativeDriver: false,
		}).start();
	}, [isOpen, contentHeight]);

	const handleLayout = (event: LayoutChangeEvent) => {
		if (isMounted.current) {
			const height = event.nativeEvent.layout.height;
			setContentHeight(height);
			if (!isOpen) {
				animatedHeight.setValue(0);
			}
		}
	};

	return (
		<Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
			<View
				style={{ opacity: 0, position: 'absolute', width: '100%' }}
				onLayout={handleLayout}
			>
				{children}
			</View>
			<View>{children}</View>
		</Animated.View>
	);
};
