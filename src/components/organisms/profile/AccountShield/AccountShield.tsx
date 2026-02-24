import { useState } from 'react';
import { Pressable } from 'react-native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { StatusMenuIcon } from '@/util/svg/icon.status_actions';
import customColor from '@/util/constant/color';
import { useNavigation } from '@react-navigation/native';
import AccountShieldMenuOptions from '@/components/molecules/profile/AccountShieldMenuOptions/AccountShieldMenuOptions';
import { generateAppopirateColor } from '@/util/helper/helper';

const AccountShield = ({ account }: { account: Patchwork.Account }) => {
	const navigation = useNavigation();

	const [menuVisible, setMenuVisible] = useState(false);
	const hideMenu = () => setMenuVisible(false);
	const showMenu = () => setMenuVisible(true);

	return (
		<>
			<Menu opened={menuVisible} onBackdropPress={hideMenu}>
				<MenuTrigger>
					<Pressable
						onPress={showMenu}
						className="p-2 rounded-full aspect-square items-center"
					>
						<StatusMenuIcon
							fill={generateAppopirateColor({
								light: '#000',
								dark: '#fff',
							})}
						/>
					</Pressable>
				</MenuTrigger>
				<MenuOptions
					customStyles={{
						optionsContainer: {
							backgroundColor: generateAppopirateColor({
								light: '#fff',
								dark: customColor['patchwork-dark-400'],
							}),
							borderRadius: 10,
							shadowOpacity: 0.1,
							elevation: 2,
						},
					}}
				>
					<AccountShieldMenuOptions
						account={account}
						hideMenu={hideMenu}
						navigation={navigation}
					/>
				</MenuOptions>
			</Menu>
		</>
	);
};

export default AccountShield;
