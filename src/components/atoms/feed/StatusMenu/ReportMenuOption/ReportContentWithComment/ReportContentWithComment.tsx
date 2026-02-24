import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { SwitchOffIcon, SwitchOnIcon } from '@/util/svg/icon.common';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ReportContentWithCommentProps {
	control: Control<
		{
			comment: string;
			forward?: boolean | undefined;
		},
		any
	>;
	isOtherServerUser: boolean;
	otherServerUserDomain: string;
}

const ReportContentWithComment = ({
	control,
	isOtherServerUser,
	otherServerUserDomain,
}: ReportContentWithCommentProps) => {
	const { t } = useTranslation();

	return (
		<View>
			<View className="my-4">
				<Controller
					control={control}
					name="comment"
					render={({ field: { onChange, value } }) => (
						<TextInput
							placeholder={t('report.placeholder.additional_comments')}
							multiline
							maxLength={4000}
							textArea
							value={value}
							onChangeText={onChange}
							autoCapitalize="none"
							spellCheck
							className="dark:text-white leading-6 font-Inter_Regular opacity-80"
						/>
					)}
				/>
			</View>

			{isOtherServerUser && (
				<View>
					<ThemeText>{t('report.forward.anonymized_message')}</ThemeText>

					<View className="flex-row items-center mt-3">
						<Controller
							control={control}
							name="forward"
							render={({ field: { onChange, value } }) => (
								<Pressable onPress={() => onChange(!value)}>
									{value ? <SwitchOnIcon /> : <SwitchOffIcon />}
								</Pressable>
							)}
						/>
						<ThemeText className="ml-2">
							{t('report.forward.forward_to_domain', {
								domain: otherServerUserDomain,
							})}
						</ThemeText>
					</View>
				</View>
			)}
		</View>
	);
};

export default ReportContentWithComment;
