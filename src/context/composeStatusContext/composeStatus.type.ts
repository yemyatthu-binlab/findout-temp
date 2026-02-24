import { Poll } from '@/types/queries/feed.type';
import { Match } from 'linkify-it';
import { Dispatch, ReactNode } from 'react';
export type ComposeType =
	| 'create'
	| 'repost'
	| 'reply'
	| 'edit'
	| 'chat'
	| 'schedule'
	| 'quote';

export type QuotePolicy = 'public' | 'followers' | 'nobody';

export type ComposeState = {
	text: {
		count: number;
		raw: string;
	};
	spoilerText: string;
	link: {
		isLinkInclude: boolean;
		firstLinkUrl: string;
		showLinkCard: boolean;
	};
	tag?: {
		schema: '@' | '#' | ':' | string;
		index: number;
		lastIndex: number;
		raw: string;
	};
	currentMention?: Match;
	disableUserSuggestionsModal?: boolean;
	maxCount: number;
	media_ids: string[];
	visibility: Patchwork.ComposeVisibility;
	in_reply_to_id?: string;
	language: string;
	poll: Poll | null;
	sensitive?: boolean;
	schedule?: {
		scheduled_at: Date;
		schedule_detail_id: string;
		is_edting_previous_schedule: boolean;
		forceCloseUserModalOnScheduleUpdate?: boolean;
	};
	forceCloseUserModalOnDraft?: boolean;
	quote_approval_policy: QuotePolicy;
};

export type ComposeAction =
	| { type: 'text'; payload: ComposeState['text'] }
	| { type: 'spoilerText'; payload: string }
	| { type: 'tag'; payload: ComposeState['tag'] }
	| { type: 'maxCount'; payload: number }
	| { type: 'link'; payload: ComposeState['link'] }
	| { type: 'currentMention'; payload: ComposeState['currentMention'] }
	| { type: 'replaceMentionText'; payload: ComposeState['text'] }
	| {
			type: 'disableUserSuggestionsModal';
			payload: Partial<ComposeState['disableUserSuggestionsModal']>;
	  }
	| { type: 'media_add'; payload: string[] }
	| { type: 'media_remove'; payload: number }
	| {
			type: 'media_replace';
			payload: { prevMediaId: string; newMediaId: string };
	  }
	| { type: 'visibility_change'; payload: ComposeState['visibility'] }
	| { type: 'reply_id_change'; payload: string }
	| { type: 'language'; payload: string }
	| { type: 'poll'; payload: ComposeState['poll'] }
	| { type: 'clear' }
	| { type: 'sensitive'; payload: ComposeState['sensitive'] }
	| { type: 'schedule'; payload: ComposeState['schedule'] }
	| { type: 'schedule-update'; payload: ComposeState }
	| { type: 'draft'; payload: ComposeState }
	| { type: 'quote_policy_change'; payload: QuotePolicy }
	| { type: 'add_emoji'; payload: { emoji: string; position: number } };

export type ComposeContextType = {
	composeState: ComposeState;
	composeDispatch: Dispatch<ComposeAction>;
};

export type ComposeStateProviderProps = {
	children: ReactNode;
	type: ComposeType;
};
