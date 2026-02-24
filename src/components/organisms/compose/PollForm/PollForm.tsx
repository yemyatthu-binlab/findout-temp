import React from 'react';
import { View } from 'react-native';
import { POLL_LIMITS } from '@/util/constant/pollOption';
import { usePollState } from '@/hooks/custom/usePollState';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { Button } from '@/components/atoms/common/Button/Button';
import PollDuration from '@/components/molecules/compose/Poll/PollDuration';
import PollOption from '@/components/molecules/compose/Poll/PollOption';
import PollType from '@/components/molecules/compose/Poll/PollType';
import { ComposeType } from '@/context/composeStatusContext/composeStatus.type';
import { cn } from '@/util/helper/twutil';
import { isTablet } from '@/util/helper/isTablet';
import { PlusIcon } from '@/util/svg/icon.profile';
import { useColorScheme } from 'nativewind';

const PollForm = ({ composeType }: { composeType?: ComposeType }) => {
	const { colorScheme } = useColorScheme();
	const { composeState } = useComposeStatus();

	const {
		options,
		duration,
		isMultiple,
		addOption,
		removeOption,
		updateOption,
		handleDurationSelect,
		handleTypeChange,
	} = usePollState();

	if (!composeState.poll) return null;

	return (
		<View
			className={cn(
				'px-3',
				composeType !== 'reply' ? 'mt-4 pb-4' : 'py-3',
				isTablet ? 'w-[75%]' : '',
			)}
			accessibilityLabel="poll-form"
		>
			<View className="mt-3">
				{/* <ThemeText
					size={'lg_18'}
					className="mb-1 md:mb-2 font-NewsCycle_Bold"
				>
					Create a poll
				</ThemeText> */}
				{options.map((option, index) => (
					<PollOption
						key={index}
						value={option}
						index={index}
						canRemove={options.length > POLL_LIMITS.MIN_OPTIONS}
						onChangeText={updateOption}
						onRemove={removeOption}
					/>
				))}
				<Button
					className="items-start rounded-lg bg-patchwork-light-100 dark:bg-patchwork-dark-50"
					disabled={options.length === POLL_LIMITS.MAX_OPTIONS}
					onPress={addOption}
				>
					<View className="border rounded-full p-0.5 border-patchwork-dark-50 dark:border-patchwork-light-100">
						<PlusIcon colorScheme={colorScheme} />
					</View>
				</Button>

				<View className="flex-row justify-between mt-3">
					<PollType
						selectedType={isMultiple}
						handleTypeChange={handleTypeChange}
					/>
					<PollDuration
						selectedDuration={duration}
						handleDurationSelect={handleDurationSelect}
					/>
				</View>
			</View>
		</View>
	);
};

export default PollForm;
