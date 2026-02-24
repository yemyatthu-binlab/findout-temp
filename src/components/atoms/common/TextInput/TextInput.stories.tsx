import type { Meta, StoryObj } from '@storybook/react';
import TextInput from './TextInput';
import {
	StoryNavigator,
	Theme,
	themeArgsType,
	ThemeProvider,
} from '../../../../../.storybook/decorators';

type ComponentWithCustomArgs = React.ComponentProps<typeof TextInput> & Theme;

const meta = {
	title: 'Atom/Common/TextInput',
	component: TextInput,
	decorators: [
		(Story, props) => (
			<StoryNavigator>
				<ThemeProvider theme={props.args.theme}>
					<Story />
				</ThemeProvider>
			</StoryNavigator>
		),
	],
} satisfies Meta<ComponentWithCustomArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InputEmpty: Story = {
	argTypes: {
		...themeArgsType,
	},
	args: {
		placeholder: 'Email',
		theme: 'dark',
	},
};

export const InputFill: Story = {
	argTypes: {
		...themeArgsType,
	},
	args: {
		placeholder: 'Email',
		value: 'mgmg@gmail.com',
		theme: 'dark',
	},
};
