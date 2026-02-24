import type { Meta, StoryObj } from '@storybook/react';
import ChannelAdditionalInformation from './ChannelAdditionalInformation';
import {
	StoryNavigator,
	Theme,
	themeArgsType,
	ThemeProvider,
} from '../../../../../.storybook/decorators';

const meta = {
	title: 'Atom/Channel/ChannelAdditionalInformation',
	component: ChannelAdditionalInformation,
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
} satisfies Meta<Theme>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	argTypes: {
		...themeArgsType,
	},
	args: {
		theme: 'dark',
	},
};
