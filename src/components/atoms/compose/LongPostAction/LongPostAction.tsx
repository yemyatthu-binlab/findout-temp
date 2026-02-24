import { Pressable } from 'react-native';
import { LongPostIcon, ShortPostIcon } from '@/util/svg/icon.compose';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useMaxCount } from '@/hooks/custom/useMaxCount';

const LongPostAction = () => {
	const { composeState, composeDispatch } = useComposeStatus();
	const maxStatusLength = useMaxCount();

	return (
		<>
			<Pressable
				className="flex-row items-center space-x-2"
				onPress={() => {
					const isLong = composeState.maxCount === maxStatusLength;
					if (isLong && composeState.text.count > 500) {
						// should show warning with options (trim, save draft or cancel)
						composeDispatch({
							type: 'text',
							payload: {
								count: 500,
								raw: composeState.text.raw.slice(0, 500),
							},
						});
					}
					composeDispatch({
						type: 'maxCount',
						payload: isLong ? 500 : maxStatusLength,
					});
				}}
			>
				{composeState.maxCount === maxStatusLength ? (
					<ShortPostIcon />
				) : (
					<LongPostIcon />
				)}
			</Pressable>
		</>
	);
};

export default LongPostAction;
