import React from 'react';
import ThemeModal from '@/components/atoms/common/ThemeModal/ThemeModal';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Linking, ScrollView, View } from 'react-native';
import { cleanText } from '@/util/helper/cleanText';
import { Button } from '@/components/atoms/common/Button/Button';
import { useTranslation } from 'react-i18next';

type Props = {
	openThemeModal: boolean;
	onClose: () => void;
	data: { label: string; content: string } | undefined;
};

export type SocialMediaLink = {
	icon: React.ReactNode;
	title: string;
};

const LinkInfoForOtherInstanceUser: React.FC<Props> = ({
	openThemeModal,
	onClose,
	data,
}) => {
	const { t } = useTranslation();
	return (
		<ThemeModal
			type="simple"
			visible={openThemeModal}
			onClose={onClose}
			modalHeight={280}
			position="bottom"
			title={data?.label}
		>
			<ScrollView showsVerticalScrollIndicator={false} className="px-3">
				{data && (
					<View className="my-1">
						<ThemeText className="mt-2 mb-5" variant="textGrey">
							{cleanText(data.content)}
						</ThemeText>
						{(cleanText(data.content).includes('https') ||
							cleanText(data.content).includes('http') ||
							cleanText(data.content).includes('www')) && (
							<Button
								onPress={() => Linking.openURL(cleanText(data.content))}
								className="mb-5"
							>
								<ThemeText className="text-white dark:text-white">
									{t('login.visit')}
								</ThemeText>
							</Button>
						)}
					</View>
				)}
			</ScrollView>
		</ThemeModal>
	);
};

export default LinkInfoForOtherInstanceUser;
