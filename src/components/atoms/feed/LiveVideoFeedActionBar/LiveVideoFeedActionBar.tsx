import React from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	faHeart as faHeartRegular,
	faComment as faCommentRegular,
} from '@fortawesome/free-regular-svg-icons';
import {
	faShare,
	faEllipsisVertical,
	faArrowUpFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { formatNumber } from '@/util/helper/helper';

interface ActionButtonsProps {
	onLike?: () => void;
	onComment?: () => void;
	onShare?: () => void;
	onMore?: () => void;
	color?: string;
	likeCount?: number;
	commentCount?: number;
}

export const LiveVideoFeedActionBar: React.FC<ActionButtonsProps> = ({
	onLike,
	onComment,
	onShare,
	onMore,
	color = 'white',
	likeCount = 0,
	commentCount = 0,
}) => {
	return (
		<View className="flex-row justify-between px-4 py-3 items-center mb-2">
			<View className="flex-row gap-4">
				<View className="items-center flex-row">
					<Pressable onPress={onLike} className="p-1 active:opacity-80">
						<FontAwesomeIcon icon={faHeartRegular} size={24} color={color} />
					</Pressable>
					{likeCount > 0 && (
						<ThemeText
							style={{ color }}
							className="text-xs font-Inter_Regular ml-0.5"
						>
							{formatNumber(likeCount)}
						</ThemeText>
					)}
				</View>
				<View className="items-center flex-row">
					<Pressable onPress={onComment} className="p-1 active:opacity-80">
						<FontAwesomeIcon icon={faCommentRegular} size={24} color={color} />
					</Pressable>
					{commentCount > 0 && (
						<ThemeText
							style={{ color }}
							className="text-xs font-Inter_Regular ml-0.5"
						>
							{formatNumber(commentCount)}
						</ThemeText>
					)}
				</View>
			</View>
			<View className="flex-row gap-4">
				<Pressable onPress={onShare} className="p-1 active:opacity-80">
					<FontAwesomeIcon
						icon={faArrowUpFromBracket}
						size={20}
						color={color}
					/>
				</Pressable>
				<Pressable onPress={onMore} className="p-1 active:opacity-80">
					<FontAwesomeIcon icon={faEllipsisVertical} size={20} color={color} />
				</Pressable>
			</View>
		</View>
	);
};
