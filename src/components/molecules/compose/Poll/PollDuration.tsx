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

type PollDurationProps = {
	selectedDuration: number;
	handleDurationSelect: (duration: number) => void;
};

const PollDuration = ({
	selectedDuration,
	handleDurationSelect,
}: PollDurationProps) => {
	const { colorScheme } = useColorScheme();
	const [durationMenuVisible, setDurationMenuVisible] = useState(false);
	const hideMenu = () => setDurationMenuVisible(false);
	const showMenu = () => setDurationMenuVisible(true);
	const { t } = useTranslation();

	const POLL_DURATION_OPTIONS = [
		{ label: t('poll.poll_duration.5_min'), value: 300 },
		{ label: t('poll.poll_duration.30_min'), value: 1800 },
		{ label: t('poll.poll_duration.1_hour'), value: 3600 },
		{ label: t('poll.poll_duration.6_hours'), value: 21600 },
		{ label: t('poll.poll_duration.1_day'), value: 86400 },
		{ label: t('poll.poll_duration.3_days'), value: 259200 },
		{ label: t('poll.poll_duration.7_days'), value: 604800 },
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
				opened={durationMenuVisible}
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
								POLL_DURATION_OPTIONS.find(
									opt => opt.value === selectedDuration,
								)?.label
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
									: customColor['patchwork-light-50'],
							borderRadius: 8,
						},
					}}
				>
					<>
						{POLL_DURATION_OPTIONS.map((option, index) => (
							<MenuOption
								onSelect={() => {
									handleDurationSelect(option.value);
									hideMenu();
								}}
								key={index}
								style={{
									paddingVertical: 10,
									paddingHorizontal: 15,
									borderRadius: 3,
								}}
							>
								<ThemeText>{option.label}</ThemeText>
							</MenuOption>
						))}
					</>
				</MenuOptions>
			</Menu>
		</View>
	);
};

export default PollDuration;
