import type { Meta, StoryObj } from '@storybook/react';
import EmailLoginForm from './EmailLoginForm';
import {
	StoryNavigator,
	Theme,
	themeArgs,
	themeArgsType,
	ThemeProvider,
} from '../../../../../.storybook/decorators/index';

const meta = {
	title: 'UI/Login/Login Form (Email)',
	component: EmailLoginForm,
	decorators: [
		(Story, property) => {
			return (
				<StoryNavigator>
					<ThemeProvider theme={(property.args as Theme).theme}>
						<Story />
					</ThemeProvider>
				</StoryNavigator>
			);
		},
	],
} satisfies Meta<typeof EmailLoginForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	argTypes: themeArgsType,
	args: themeArgs,
};
