import React from 'react';
import { View, Pressable } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { ChevronRightIcon } from '@/util/svg/icon.common';
import styles from './Card.style';
import Image from '../common/Image/Image';
import { VariantProps, cva } from 'class-variance-authority';

const cardVariant = cva('rounded-[4px] overflow-hidden shadow-lg bg-white', {
	variants: {
		variants: {
			default: /* tw */ '',
			browsing: /* tw */ 'w-40 h-20',
			channels: /* tw */ 'w-[342px] h-[240px]',
		},
		gutters: {
			default: /* tw */ 'mr-2',
			mx3: /* tw */ 'mx-3',
			mr4: /* tw */ 'mr-4',
		},
	},
	defaultVariants: {
		variants: 'default',
		gutters: 'default',
	},
});

const imageVariant = cva('w-36 h-36', {
	variants: {
		imageVariants: {
			default: '',
			browsing: /* tw */ 'w-40 h-20',
			searchChannels: /* tw */ 'w-[163.5] h-[149]',
			relatedChannels: /* tw */ 'w-[342px] h-[200px]',
		},
	},
	defaultVariants: {
		imageVariants: 'default',
	},
});

type ExtraProps = {
	imageSource: string | number | undefined;
	title: string;
	activeNow?: boolean;
	onPress: () => void;
};
type CardProps = React.ComponentPropsWithoutRef<typeof View> &
	ExtraProps &
	VariantProps<typeof cardVariant> &
	VariantProps<typeof imageVariant>;

const Card = ({
	imageSource,
	activeNow,
	title,
	onPress,
	imageVariants,
	variants,
	gutters,
	...props
}: CardProps) => {
	return (
		<View className="my-1" {...props}>
			{activeNow && <View className={styles.activeNow} />}
			<Pressable
				onPress={onPress}
				className={cardVariant({ variants, gutters })}
			>
				<Image uri={imageSource} className={imageVariant({ imageVariants })} />
			</Pressable>
			<View className={styles.cardFooter}>
				<ThemeText className="text-white">{title}</ThemeText>
				<ChevronRightIcon />
			</View>
		</View>
	);
};

export default Card;
