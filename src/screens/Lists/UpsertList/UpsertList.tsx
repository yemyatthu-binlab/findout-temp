import { Pressable, View } from 'react-native';
import SafeScreen from '@/components/template/SafeScreen/SafeScreen';
import Header from '@/components/atoms/common/Header/Header';
import BackButton from '@/components/atoms/common/BackButton/BackButton';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { listFormSchema, ListsFormValues } from '@/util/schema/listSchema';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { Button } from '@/components/atoms/common/Button/Button';
import { Flow } from 'react-native-animated-spinkit';
import { useUpsertListsMutation } from '@/hooks/mutations/lists.mutation';
import { queryClient } from '@/App';
import {
	listsQueryKey,
	useListsDetailQuery,
} from '@/hooks/queries/lists.queries';
import ListRepliesPolicy from '@/components/molecules/lists/ListRepliesPolicy';
import { SwitchOffIcon, SwitchOnIcon } from '@/util/svg/icon.common';
import { ListsStackScreenProps } from '@/types/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import MembersLink from '@/components/organisms/lists/MembersLink';
import { cn } from '@/util/helper/twutil';
import { isTablet } from '@/util/helper/isTablet';
import { useTranslation } from 'react-i18next';

const UpsertList = ({
	navigation,
	route,
}: ListsStackScreenProps<'UpsertList'>) => {
	const { t } = useTranslation();
	const isEdit = route.params.type === 'edit';
	const listId = useMemo(
		() => (isEdit ? route.params.id : undefined),
		[isEdit, route.params],
	);

	const {
		setValue,
		watch,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ListsFormValues>({
		resolver: yupResolver(listFormSchema),
		mode: 'onChange',
		defaultValues: { title: '', replies_policy: 'list', exclusive: false },
	});

	const listTimelinesTitle = watch('title');

	const { data: list } = useListsDetailQuery({
		id: listId,
		options: {
			enabled: !!listId,
		},
	});

	useEffect(() => {
		if (isEdit && list) {
			Object.entries(list).forEach(([key, value]) => {
				return setValue(key as keyof ListsFormValues, value);
			});
		}
	}, [isEdit, list, setValue]);

	const { mutateAsync, isPending } = useUpsertListsMutation({
		onSuccess(data) {
			queryClient.setQueryData(
				listsQueryKey,
				(oldData: Patchwork.Lists[] | undefined) => {
					if (!oldData) return [data];

					const updatedData = oldData.map(item =>
						item.id === data.id ? data : item,
					);
					return updatedData.some(item => item.id === data.id)
						? updatedData
						: [...updatedData, data];
				},
			);
			if (isEdit) {
				navigation.navigate('Lists');
			} else {
				navigation.replace('ManageListMembers', {
					listId: data.id,
					listTimelinesTitle,
				});
			}
		},
	});

	const onSubmit = (values: ListsFormValues) =>
		mutateAsync({ id: listId, ...values });

	const renderHeaderTitle = useCallback(
		() => (isEdit ? t('screen.edit_list') : t('screen.create_list')),
		[isEdit],
	);

	return (
		<SafeScreen>
			<Header
				title={renderHeaderTitle()}
				leftCustomComponent={<BackButton />}
				underlineClassName="mb-0"
			/>

			<View className={cn('p-6', isTablet ? 'w-[50%] self-center' : '')}>
				<Controller
					name="title"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<View className="mb-4">
							<ThemeText className="mb-2">{t('list.list_name')}</ThemeText>
							<TextInput
								onChangeText={onChange}
								value={value}
								onBlur={onBlur}
								maxLength={40}
							/>
							{errors.title && (
								<ThemeText size="xs_12" variant={'textOrange'} className="mt-1">
									{'*' + errors.title.message}
								</ThemeText>
							)}
						</View>
					)}
				/>

				<Controller
					name="replies_policy"
					control={control}
					render={({ field: { value, onChange } }) => (
						<View className="mb-4">
							<ThemeText className="mb-2">{t('list.include_reply')}</ThemeText>
							<ListRepliesPolicy
								selectedRepliesPolicy={value}
								handleRepliesPolicySelect={onChange}
							/>
						</View>
					)}
				/>

				{listId && (
					<MembersLink
						listId={listId}
						onPress={() =>
							navigation.navigate('ManageListMembers', {
								listId: listId,
								listTimelinesTitle,
							})
						}
					/>
				)}

				<Controller
					name="exclusive"
					control={control}
					render={({ field: { value, onChange } }) => (
						<View className="mb-4 flex-row items-center">
							<View className="flex-1">
								<ThemeText className="mb-2">
									{t('list.list_only_members')}
								</ThemeText>
								<ThemeText variant={'textGrey'} size={'fs_13'}>
									{t('list.list_only_member_desc')}
								</ThemeText>
							</View>
							<Pressable
								onPress={() => {
									onChange(!value);
								}}
							>
								{value ? (
									<SwitchOnIcon width={42} />
								) : (
									<SwitchOffIcon width={42} />
								)}
							</Pressable>
						</View>
					)}
				/>

				<Button
					disabled={isPending}
					onPress={handleSubmit(onSubmit)}
					className="my-3 "
				>
					{isPending ? (
						<Flow size={25} color={'#fff'} />
					) : (
						<ThemeText className="text-white dark:text-white">
							{isEdit ? t('list.update_list') : t('list.create_list')}
						</ThemeText>
					)}
				</Button>
			</View>
		</SafeScreen>
	);
};

export default UpsertList;
