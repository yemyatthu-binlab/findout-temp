import { View } from 'react-native';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { cn } from '@/util/helper/twutil';
import Image from '../../common/Image/Image';

type Props = {
	accounts: Patchwork.Account[];
	firstImageExtraStyle?: string;
	secImageExtraStyle?: string;
	additionalUserCountExtraStyle?: string;
	secImageWrapperExtraStyle?: string;
};
const ConversationImage = ({
	accounts,
	firstImageExtraStyle,
	secImageExtraStyle,
	secImageWrapperExtraStyle,
	additionalUserCountExtraStyle,
}: Props) => {
	const isGroupChat = accounts.length > 1;
	return (
		<View>
			{isGroupChat ? (
				<View className="flex-row">
					{accounts.map((item, idx) => {
						if (idx == 2) {
							return (
								<View
									className={cn(
										'w-9 h-9 absolute bottom-5 left-5 border border-slate-100 rounded-full -z-10 items-center justify-center',
										additionalUserCountExtraStyle,
									)}
									style={{ backgroundColor: '#1e293baa' }}
									key={idx}
								>
									<ThemeText size={'xs_12'} className="text-center text-white">
										+ {accounts.length - 2}
									</ThemeText>
								</View>
							);
						}
						if (idx > 2) return <View key={idx}></View>;
						return (
							<View
								className={cn(
									idx == 1 &&
										'absolute bottom-5 left-5 border border-slate-100 rounded-full -z-10',
									idx == 1 && secImageWrapperExtraStyle,
								)}
								key={idx}
							>
								<Image
									uri={item.avatar}
									className={
										idx == 1
											? cn('w-8 h-8 rounded-full', secImageExtraStyle)
											: cn(
													'w-10 h-10 rounded-full mr-8 border border-slate-100',
													firstImageExtraStyle,
											  )
									}
									iconSize={35}
								/>
							</View>
						);
					})}
				</View>
			) : (
				<Image
					uri={accounts[0].avatar}
					className="w-14 h-14 border border-slate-100 rounded-full mr-3"
					iconSize={54}
				/>
			)}
		</View>
	);
};

export default ConversationImage;
