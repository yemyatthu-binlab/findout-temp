import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { PollDropperIcon } from '@/util/svg/icon.compose';
import {
	Menu,
	MenuOption,
	MenuOptions,
	MenuTrigger,
	renderers,
} from 'react-native-popup-menu';
import customColor from '@/util/constant/color';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

type PollTypeProps = {
	selectedType: boolean;
	handleTypeChange: (value: boolean) => void;
};

const PollType = ({ selectedType, handleTypeChange }: PollTypeProps) => {
	const [choiceMenuVisible, setChoiceMenuVisible] = useState(false);
	const hideMenu = () => setChoiceMenuVisible(false);
	const showMenu = () => setChoiceMenuVisible(true);
	const { colorScheme } = useColorScheme();
	const { t } = useTranslation();

	const POLL_TYPES = [
		{ label: t('poll.single_choice'), value: false },
		{ label: t('poll.multiple_choice'), value: true },
	];

	return (
		<View>
			<Menu
				renderer={renderers.Popover}
				rendererProps={{
					placement: 'top',
					anchorStyle: {
						width: 0,
						height: 0,
					},
				}}
				opened={choiceMenuVisible}
				style={{ zIndex: 1000 }}
				onBackdropPress={hideMenu}
			>
				<MenuTrigger>
					<Pressable
						onPress={showMenu}
						style={{ flexDirection: 'row', alignItems: 'center' }}
					>
						<ThemeText className="mr-1">
							{POLL_TYPES.find(opt => opt.value === selectedType)?.label}
						</ThemeText>
						<PollDropperIcon {...{ colorScheme }} />
					</Pressable>
				</MenuTrigger>
				<MenuOptions
					customStyles={{
						optionsContainer: {
							backgroundColor:
								colorScheme === 'dark'
									? customColor['patchwork-dark-50']
									: customColor['patchwork-light-50'],
							borderRadius: 8,
							shadowOpacity: 0.1,
							elevation: 2,
						},
					}}
				>
					<>
						{POLL_TYPES.map((type, index) => (
							<MenuOption
								onSelect={() => {
									handleTypeChange(type.value);
									hideMenu();
								}}
								key={index}
								style={{
									paddingHorizontal: 15,
									paddingVertical: 10,
									borderRadius: 3,
								}}
							>
								<ThemeText>{type.label}</ThemeText>
							</MenuOption>
						))}
					</>
				</MenuOptions>
			</Menu>
		</View>
	);
};

export default PollType;
