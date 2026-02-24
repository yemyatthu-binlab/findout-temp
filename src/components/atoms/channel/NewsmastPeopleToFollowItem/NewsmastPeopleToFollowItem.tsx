import { useNavigation } from '@react-navigation/native';
import { View, Pressable } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { useSpecificServerProfile } from '@/hooks/queries/profile.queries';
import { findAccountId, truncateStr } from '@/util/helper/helper';
import Image from '../../common/Image/Image';
import { cn } from '@/util/helper/twutil';
import VerticalInfo from '@/components/molecules/account/UserAccountInfo/UserAccountInfo';

interface Props {
	item: Patchwork.NewsmastComunityContributorList;
	showAsVerticalItem?: boolean;
}

const NewsmastPeopleToFollowItem = ({ item, showAsVerticalItem }: Props) => {
	const navigation = useNavigation();

	const { data: specificServerProfile } = useSpecificServerProfile({
		q: item?.attributes?.acct as string,
		options: {
			enabled: !!item?.attributes?.acct,
			staleTime: 1000 * 60 * 15,
			gcTime: 1000 * 60 * 60 * 15,
		},
	});

	const findAccountId = (
		specificServerProfile: Patchwork.SearchResult | null | undefined,
		accountInfoData:
			| Patchwork.NewsmastComunityContributorList
			| null
			| undefined,
	): string | undefined => {
		const accounts = specificServerProfile?.accounts ?? [];

		const normalized = accountInfoData?.attributes?.acct.startsWith('@')
			? accountInfoData.attributes?.acct.slice(1)
			: accountInfoData?.attributes?.acct;

		if (accounts.length > 1 && accountInfoData?.attributes) {
			const foundAccount = accounts.find(acc => acc.acct === normalized);
			return foundAccount?.id ?? accountInfoData.id;
		}

		return accounts.length > 0 ? accounts[0].id : accountInfoData?.id;
	};

	const accountId = findAccountId(specificServerProfile, item);

	return (
		<View>
			{showAsVerticalItem ? (
				<View className="mx-4">
					<Pressable
						className="flex-row px-3 py-3 active:opacity-80"
						onPress={() => {
							navigation.navigate('ProfileOther', {
								id: accountId!,
							});
						}}
					>
						<View className="flex-1 flex-row mr-2">
							<Pressable>
								<Image
									className={cn(
										'w-10 h-10 border-patchwork-grey-400 border rounded-full',
									)}
									uri={item.attributes.avatar_url}
								/>
							</Pressable>
							<VerticalInfo
								hasRedMark={false}
								accountName={
									item.attributes.display_name || item.attributes.username
								}
								username={item.attributes.username}
								userBio={''}
								acctNameTextStyle="text-[14px]"
							/>
						</View>
					</Pressable>
				</View>
			) : (
				<View className="items-center mr-4 my-1">
					<View className="flex-row justify-between items-center px-5">
						<Pressable
							onPress={() => {
								navigation.navigate('ProfileOther', {
									id: accountId!,
								});
							}}
							className="flex-1 items-center my-3"
						>
							<View className="p-[3] border border-slate-300 rounded-full">
								<Image
									uri={item?.attributes.avatar_url}
									className="w-[80] h-[80] rounded-full bg-slate-300"
								/>
							</View>
							<View className="items-center mt-2">
								<ThemeText
									ellipsizeMode="tail"
									numberOfLines={1}
									className="font-semibold"
								>
									{truncateStr(
										item.attributes.display_name || item.attributes.username,
										10,
									)}
								</ThemeText>
								<ThemeText variant="textGrey" size="fs_13">
									@{truncateStr(item.attributes.username, 10)}
								</ThemeText>
							</View>
						</Pressable>
					</View>
				</View>
			)}
		</View>
	);
};

export default NewsmastPeopleToFollowItem;
