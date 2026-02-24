import type { Meta, StoryObj } from '@storybook/react';
import ChannelRuleCircle from './ChannelRuleCircle';
import {
	StoryNavigator,
	Theme,
	themeArgsType,
	ThemeProvider,
} from '../../../../../.storybook/decorators';

type ComponentWithCustomArgs = React.ComponentProps<typeof ChannelRuleCircle> &
	Theme;

const meta = {
	title: 'Atom/Channel/ChannelRuleCircle',
	component: ChannelRuleCircle,
	decorators: [
		(Story, props) => {
			return (
				<StoryNavigator>
					<ThemeProvider theme={props.args.theme}>
						<Story />
					</ThemeProvider>
				</StoryNavigator>
			);
		},
	],
} satisfies Meta<ComponentWithCustomArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	argTypes: {
		...themeArgsType,
		count: { range: true, min: 1, max: 99, step: 1 },
	},
	args: {
		theme: 'dark',
		count: 1,
	},
};
