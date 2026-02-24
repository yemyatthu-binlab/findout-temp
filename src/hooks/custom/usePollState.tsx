import { useEffect, useState, useCallback, useMemo } from 'react';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';

const DEFAULT_DURATION = 86400;
const MAX_OPTIONS = 4;

export const usePollState = () => {
	const { composeState, composeDispatch } = useComposeStatus();

	const [options, setOptions] = useState<string[]>(['', '']);
	const [duration, setDuration] = useState<number>(DEFAULT_DURATION);
	const [isMultiple, setIsMultiple] = useState<boolean>(false);

	useEffect(() => {
		if (composeState.poll) {
			setOptions(composeState.poll.options || ['', '']);
			setDuration(composeState.poll.expires_in || DEFAULT_DURATION);
			setIsMultiple(composeState.poll.multiple || false);
		} else {
			setOptions(['', '']);
			setDuration(DEFAULT_DURATION);
			setIsMultiple(false);
		}
	}, [composeState.poll]);

	const updatePoll = useCallback(
		(pollOptions: string[], expiresIn: number, multiple: boolean) => {
			composeDispatch({
				type: 'poll',
				payload: {
					options: pollOptions,
					expires_in: expiresIn,
					multiple: multiple,
				},
			});
		},
		[composeDispatch],
	);

	const addOption = useCallback(() => {
		if (options.length < MAX_OPTIONS) {
			const newOptions = [...options, ''];
			setOptions(newOptions);
			updatePoll(newOptions, duration, isMultiple);
		}
	}, [options, duration, isMultiple, updatePoll]);

	const removeOption = useCallback(
		(index: number) => {
			if (options.length > 2) {
				const newOptions = options.filter((_, i) => i !== index);
				setOptions(newOptions);
				updatePoll(newOptions, duration, isMultiple);
			}
		},
		[options, duration, isMultiple, updatePoll],
	);

	const updateOption = useCallback(
		(text: string, index: number) => {
			const newOptions = [...options];
			newOptions[index] = text;
			setOptions(newOptions);
			updatePoll(newOptions, duration, isMultiple);
		},
		[options, duration, isMultiple, updatePoll],
	);

	const handleDurationSelect = useCallback(
		(value: number) => {
			setDuration(value);
			updatePoll(options, value, isMultiple);
		},
		[options, isMultiple, updatePoll],
	);

	const handleTypeChange = useCallback(
		(value: boolean) => {
			setIsMultiple(value);
			updatePoll(options, duration, value);
		},
		[options, duration, updatePoll],
	);

	return useMemo(
		() => ({
			options,
			duration,
			isMultiple,
			addOption,
			removeOption,
			updateOption,
			handleDurationSelect,
			handleTypeChange,
		}),
		[
			options,
			duration,
			isMultiple,
			addOption,
			removeOption,
			updateOption,
			handleDurationSelect,
			handleTypeChange,
		],
	);
};
