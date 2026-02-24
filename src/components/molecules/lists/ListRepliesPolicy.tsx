import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { PollDropperIcon } from '@/util/svg/icon.compose';
import {
	Menu,
	MenuOption,
	MenuOptions,
	MenuTrigger,
} from 'react-native-popup-menu';
import customColor from '@/util/constant/color';
import { REPLIES_POLICY } from '@/util/constant/repliesPolicy';
import { CheckIcon } from '@/util/svg/icon.common';
import { useColorScheme } from 'nativewind';

type ListRepliesPolicyProps = {
	selectedRepliesPolicy: string;
	handleRepliesPolicySelect: (val: 'followed' | 'list' | 'none') => void;
};

const ListRepliesPolicy = ({
	selectedRepliesPolicy,
	handleRepliesPolicySelect,
}: ListRepliesPolicyProps) => {
	const { colorScheme } = useColorScheme();
	const [menuVisible, setMenuVisible] = useState(false);
	const hideMenu = () => setMenuVisible(false);
	const showMenu = () => setMenuVisible(true);

	return (
		<View>
			<Menu
				opened={menuVisible}
				style={{ zIndex: 1000 }}
				onBackdropPress={hideMenu}
			>
				<MenuTrigger>
					<Pressable
						onPress={showMenu}
						style={{ flexDirection: 'row', alignItems: 'center' }}
					>
						<ThemeText variant={'textSecondary'} className="mr-1">
							{
								REPLIES_POLICY.find(opt => opt.value === selectedRepliesPolicy)
									?.label
							}
						</ThemeText>
						<PollDropperIcon
							stroke={
								colorScheme === 'dark'
									? customColor['patchwork-primary-dark']
									: customColor['patchwork-primary']
							}
						/>
					</Pressable>
				</MenuTrigger>
				<MenuOptions
					customStyles={{
						optionsContainer: {
							backgroundColor:
								colorScheme === 'dark'
									? customColor['patchwork-dark-50']
									: customColor['patchwork-light-100'],
							borderRadius: 8,
						},
					}}
				>
					<>
						{REPLIES_POLICY.map((option, index) => (
							<MenuOption
								onSelect={() => {
									handleRepliesPolicySelect(option.value);
									hideMenu();
								}}
								key={index}
								style={styles.policyOptions}
							>
								<ThemeText>{option.label}</ThemeText>
								{selectedRepliesPolicy === option.value && <CheckIcon />}
							</MenuOption>
						))}
					</>
				</MenuOptions>
			</Menu>
		</View>
	);
};

export default ListRepliesPolicy;

const styles = StyleSheet.create({
	policyOptions: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 3,
	},
});
