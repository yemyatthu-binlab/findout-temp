import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import Underline from '@/components/atoms/common/Underline/Underline';
import { RemoveCrossIcon } from '@/util/svg/icon.status_actions';
import React, { useMemo, useState } from 'react';
import {
	View,
	Modal,
	Pressable,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import ReportContentData from '../ReportContentData/ReportContentData';
import { ReportItem } from '@/util/constant/reportItem';
import { Button } from '@/components/atoms/common/Button/Button';
import { useForm } from 'react-hook-form';
import ReportViolationData from '../ReportViolationData/ReportViolationData';
import ReportContentWithComment from '../ReportContentWithComment/ReportContentWithComment';
import { useReportMutation } from '@/hooks/mutations/feed.mutation';
import { Flow } from 'react-native-animated-spinkit';
import customColor from '@/util/constant/color';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

interface ReportContentModalProps {
	status?: Patchwork.Status;
	account?: Patchwork.Account;
	visible: boolean;
	onClose: () => void;
}
const ReportContentModal = ({
	visible,
	onClose,
	status,
	account,
}: ReportContentModalProps) => {
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<{ comment: string; forward?: boolean }>();

	const isOtherServerUser = status
		? status.account.acct.includes('@')
		: account?.acct.includes('@');
	const otherServerUserDomain = status
		? status.account.acct.split('@')[1]
		: account?.acct.split('@')[1];

	const [page, setPage] = useState(1);
	const [selectedCategory, setSelectedCategory] =
		useState<ReportItem['category']>('');
	const [selectedViolationItem, setSelectedViolationItem] = useState<string[]>(
		[],
	);

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
	};

	const handleCheckboxChange = (value: string) => {
		if (selectedViolationItem.includes(value)) {
			setSelectedViolationItem(
				selectedViolationItem.filter(item => item !== value),
			);
		} else {
			setSelectedViolationItem([...selectedViolationItem, value]);
		}
	};

	const onNextPage = () => {
		setPage(prev => prev + 1);
	};

	const displayReportDialogModalTitle = useMemo(() => {
		if ((page === 2 && selectedCategory !== 'violation') || page === 3) {
			return t('report.modal_title_additional_info');
		}
		if (page === 2 && selectedCategory === 'violation') {
			return t('report.modal_title_violation_rules');
		}
		if (page === 1) {
			return t('report.modal_title_category');
		}
	}, [page, selectedCategory, t]);

	const showAdditionalCommentTextarea = useMemo(() => {
		if (page === 3) return true;
		if (page === 2 && selectedCategory !== 'violation') return true;
		return false;
	}, [page, selectedCategory]);

	const { mutate, isPending } = useReportMutation({
		onSuccess: () => {
			reset();
			onClose();
		},
	});

	const onSubmit = (data: { comment: string; forward?: boolean }) => {
		if (page === 1 || (page === 2 && selectedCategory === 'violation')) {
			onNextPage();
		} else {
			const payload = {
				category: selectedCategory,
				comment: data.comment ?? '',
				account_id: status ? status.account.id : account?.id,
				status_ids: [],
				forward: data.forward ?? false,
				forward_to_domains: data.forward ? [otherServerUserDomain!] : [],
				rule_ids: selectedViolationItem ?? [],
			};
			mutate(payload);
		}
	};

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
			statusBarTranslucent
			navigationBarTranslucent
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className="flex-1 items-center justify-center bg-black/70"
			>
				<View className="bg-white dark:bg-zinc-900 w-11/12 rounded-md">
					<View className="py-3 px-7 items-start justify-center">
						<ThemeText className="text-left">
							{t('report.reporting')}{' '}
							{status ? status.account.acct : account?.acct}
						</ThemeText>
						<Pressable className="absolute top-3 right-2" onPress={onClose}>
							<RemoveCrossIcon />
						</Pressable>
					</View>
					<Underline className="dark:border-zinc-600" />
					<View className="px-5 py-3">
						<ThemeText className="font-NewsCycle_Bold">
							{displayReportDialogModalTitle}
						</ThemeText>
						{page === 1 && (
							<ReportContentData
								selectedCategory={selectedCategory}
								handleCategoryChange={handleCategoryChange}
							/>
						)}
						{page === 2 && selectedCategory === 'violation' && (
							<ReportViolationData
								selectedViolationItem={selectedViolationItem}
								handleCheckboxChange={handleCheckboxChange}
							/>
						)}
						{showAdditionalCommentTextarea && (
							<ReportContentWithComment
								control={control}
								isOtherServerUser={isOtherServerUser!}
								otherServerUserDomain={otherServerUserDomain!}
							/>
						)}
						<Button
							disabled={
								page === 1
									? selectedCategory === ''
									: selectedCategory === 'violation' &&
									  selectedViolationItem.length === 0
							}
							onPress={handleSubmit(onSubmit)}
							className="mt-7 mb-2 dark:bg-patchwork-soft-primary"
						>
							{isPending ? (
								<Flow size={25} color={'#fff'} className="ml-1" />
							) : (
								<ThemeText className="text-white dark:text-white">
									{page === 1 ||
									(page === 2 && selectedCategory === 'violation')
										? t('common.continue')
										: t('common.submit')}
								</ThemeText>
							)}
						</Button>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

export default ReportContentModal;
