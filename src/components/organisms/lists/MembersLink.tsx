import { memo, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useListMembersQuery } from '@/hooks/queries/lists.queries';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import FastImage from '@d11/react-native-fast-image';
import Image from '@/components/atoms/common/Image/Image';
import { useTranslation } from 'react-i18next';

const MembersLink = ({
	listId,
	onPress,
}: {
	listId: string | undefined;
	onPress: () => void;
}) => {
	const { t } = useTranslation();
	const [avatars, setAvatars] = useState<string[]>([]);

	const { data } = useListMembersQuery({
		id: listId,
		options: {
			enabled: !!listId,
		},
	});

	useEffect(() => {
		if (data) {
			setAvatars(data.slice(0, 3).map(a => a.avatar));
		}
	}, [data]);

	return (
		<Pressable className="mb-4 flex-row items-center" onPress={onPress}>
			<View className="flex-1">
				<ThemeText>{t('list_members')}</ThemeText>
				<ThemeText variant={'textOrangeUnderline'}>
					{t('list.member', { count: data?.length || 0 })}
				</ThemeText>
			</View>
			<View className="flex-row items-center">
				{avatars.map((url, index) => (
					<Image
						key={index}
						className={`w-8 h-8 rounded-lg ${
							index !== avatars.length - 1 ? '-mr-3' : ''
						} ${index === 0 ? '-rotate-3' : ''}`}
						uri={url}
						resizeMode={FastImage.resizeMode.contain}
					/>
				))}
			</View>
		</Pressable>
	);
};

export default memo(MembersLink);
