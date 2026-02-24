// store/usePollStore.ts
import { create } from 'zustand';

interface PollOption {
	id: number;
	text: string;
	textLength: number;
}

interface PollState {
	question: string;
	options: PollOption[];
	duration: string;
	isPollCreated: boolean;
	setQuestion: (question: string) => void;
	addOption: (optionText: string) => void;
	updateOption: (id: number, text: string) => void;
	deleteOption: (id: number) => void;
	setDuration: (duration: string) => void;
	setPollCreate: (isPollCreated: boolean) => void;
}

export const usePollStore = create<PollState>(set => ({
	question: '',
	options: [
		{ id: 1, text: '', textLength: 25 },
		{ id: 2, text: '', textLength: 25 },
	],
	duration: '6 hours',
	isPollCreated: false,
	setQuestion: question => set({ question }),
	addOption: optionText =>
		set(state => ({
			options: [
				...state.options,
				{ id: state.options.length + 1, text: optionText, textLength: 25 },
			],
		})),
	updateOption: (id, text) =>
		set(state => ({
			options: state.options.map(opt =>
				opt.id === id ? { ...opt, text } : opt,
			),
		})),
	deleteOption: id =>
		set(state => ({
			options: state.options.filter(opt => opt.id !== id),
		})),
	setDuration: duration => set({ duration }),
	setPollCreate: status => set(state => ({ ...state, isPollCreated: status })),
}));
