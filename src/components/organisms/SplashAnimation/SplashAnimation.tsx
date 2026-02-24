import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, View } from 'react-native';
import { Wander } from 'react-native-animated-spinkit';
import customColor from '../../../util/constant/color';
import { BlockIcon } from '../../../util/svg/icon.common';

interface SplashAnimationProps {
	onFinishAnimation: () => void;
}

const SplashAnimation: React.FC<SplashAnimationProps> = ({
	onFinishAnimation,
}) => {
	const { width, height } = Dimensions.get('window');
	const [showSpinner, setShowSpinner] = useState(false);

	const animationValue = useRef(new Animated.Value(0)).current;
	const findOutX = useRef(new Animated.Value(width)).current;
	const blockScale = useRef(new Animated.Value(0)).current;
	const blockSquash = useRef(new Animated.Value(1)).current;
	const mediaX = useRef(new Animated.Value(-width)).current;
	const containerTranslateY = useRef(new Animated.Value(0)).current;
	const spinnerOpacity = useRef(new Animated.Value(0)).current;
	const spinnerTranslateY = useRef(new Animated.Value(20)).current;

	useEffect(() => {
		Animated.timing(animationValue, {
			toValue: 1,
			duration: 2000,
			easing: Easing.bezier(0.4, 0, 0.2, 1),
			useNativeDriver: true,
		}).start();

		Animated.sequence([
			// 1. Block scales up
			Animated.timing(blockScale, {
				toValue: 1,
				duration: 800,
				easing: Easing.back(1.5),
				useNativeDriver: true,
			}),

			// 2. FindOutText runs from right and hits block
			Animated.sequence([
				Animated.timing(findOutX, {
					toValue: 0,
					duration: 600,
					easing: Easing.out(Easing.quad),
					useNativeDriver: true,
				}),
			]),

			// 3. MediaText runs from left and hits block
			Animated.sequence([
				Animated.timing(mediaX, {
					toValue: 0,
					duration: 600,
					easing: Easing.out(Easing.quad),
					useNativeDriver: true,
				}),
			]),
		]).start(() => {
			setShowSpinner(true);
			// Start looping squash breathing effect when spinner shows
			Animated.loop(
				Animated.sequence([
					Animated.timing(blockSquash, {
						toValue: 0.9,
						duration: 1000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
					Animated.timing(blockSquash, {
						toValue: 1,
						duration: 1000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
				]),
			).start();

			Animated.parallel([
				Animated.timing(containerTranslateY, {
					toValue: -30, // Move up slightly
					duration: 800,
					easing: Easing.out(Easing.quad),
					useNativeDriver: true,
				}),
				Animated.timing(spinnerOpacity, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(spinnerTranslateY, {
					toValue: 0,
					duration: 800,
					easing: Easing.out(Easing.quad),
					useNativeDriver: true,
				}),
			]).start(() => {
				onFinishAnimation();
			});
		});
	}, []);

	return (
		<View className="flex-1 bg-white items-center justify-center overflow-hidden">
			<Animated.View
				style={{
					position: 'absolute',
					width: 100,
					height: 100,
					borderRadius: 100,
					backgroundColor: customColor['patchwork-primary'],
					transform: [
						{
							scale: animationValue.interpolate({
								inputRange: [0, 0.2, 1],
								outputRange: [0, 1, 20],
							}),
						},
					],
				}}
			/>
			<Animated.View
				style={{ transform: [{ translateY: containerTranslateY }] }}
				className="items-center"
			>
				<Animated.View
					style={{
						transform: [{ translateX: findOutX }],
					}}
					className="self-start mb-1"
				>
					<Image
						source={require('../../../../assets/images/FINDOUT_TEXT.png')}
						style={{ width: 130, height: 40 }}
					/>
				</Animated.View>

				<Animated.View
					style={{
						transform: [{ scale: blockScale }, { scaleY: blockSquash }],
					}}
				>
					<BlockIcon />
				</Animated.View>

				<Animated.View
					style={{
						transform: [{ translateX: mediaX }],
					}}
					className="self-end mt-2"
				>
					<Image
						source={require('../../../../assets/images/MEDIA_TEXT.png')}
						style={{ width: 95, height: 28 }}
					/>
				</Animated.View>
			</Animated.View>

			{showSpinner && (
				<Animated.View
					style={{
						opacity: spinnerOpacity,
						transform: [{ translateY: spinnerTranslateY }],
					}}
					className="mt-10"
				>
					<Wander size={40} color="white" />
				</Animated.View>
			)}
		</View>
	);
};

export default SplashAnimation;
