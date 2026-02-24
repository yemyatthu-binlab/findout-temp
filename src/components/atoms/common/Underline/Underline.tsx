import { View, ViewProps } from 'react-native';

const Underline = (props: ViewProps) => {
	return (
		<View
			className="border-b border-slate-200 dark:border-patchwork-grey-70"
			{...props}
		/>
	);
};

export default Underline;
