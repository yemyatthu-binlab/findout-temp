import LinkifyIt, { Match } from 'linkify-it';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { useComposeStatus } from '@/context/composeStatusContext/composeStatus.context';
import { useEffect, useMemo, useRef } from 'react';
import { isEqual } from 'lodash';
import {
	findFirstLink,
	findMentionChanges,
	showLinkCardIfNotManuallyClose,
} from '@/util/helper/compose';

const linkify = new LinkifyIt();

linkify
	.add('@', {
		validate: function (text, pos, self) {
			const tail = text.slice(pos);

			if (!self.re.mention) {
				self.re.mention = new RegExp('^\\S+');
			}
			if (self.re.mention.test(tail)) {
				return tail.match(self.re.mention)![0].length;
			}
			return 0;
		},
	})
	.add('#', {
		validate: function (text, pos, self) {
			const tail = text.slice(pos);

			if (!self.re.hashtag) {
				self.re.hashtag = new RegExp('^[\\S]+');
			}
			if (self.re.hashtag.test(tail)) {
				return tail.match(self.re.hashtag)![0].length;
			}
			return 0;
		},
	})
	.add(':', {
		validate: function (text, pos, self) {
			const tail = text.slice(pos);

			if (!self.re.emoji) {
				self.re.emoji = new RegExp('^(?:([^:]+):)');
			}
			if (self.re.emoji.test(tail)) {
				return tail.match(self.re.emoji)![0].length;
			}
			return 0;
		},
	});

export const FormattedText = ({ text }: { text: string }) => {
	const matches = useMemo(() => linkify.match(text) || [], [text]);
	const previousMatches = useRef<Match[]>(undefined);
	const mentionList = matches?.filter(item => item.schema == '@');
	const prevMentionList = useRef<Match[]>(undefined);
	const { composeState, composeDispatch } = useComposeStatus();
	const elements = [];
	let lastIndex = 0;

	useEffect(() => {
		if (!isEqual(matches, previousMatches.current)) {
			const firstLink = !!matches ? findFirstLink(matches) : '';
			const mentionChanges = findMentionChanges(
				mentionList,
				prevMentionList.current,
			);
			prevMentionList.current = mentionList;
			previousMatches.current = matches;
			dispatchMentionChanges(mentionChanges);
			dispatchFirstLink(firstLink);
		}
	}, [matches]);

	const dispatchFirstLink = (firstLink: string) => {
		composeDispatch({
			type: 'link',
			payload: {
				isLinkInclude: !!firstLink,
				showLinkCard:
					!!firstLink &&
					!!matches &&
					showLinkCardIfNotManuallyClose(
						matches[0].url,
						composeState.link.firstLinkUrl,
						composeState.link.showLinkCard,
					),
				firstLinkUrl: !!firstLink ? firstLink : '',
			},
		});
	};

	const dispatchMentionChanges = (mentionChanges: Match[]) => {
		if (!composeState.disableUserSuggestionsModal) {
			return composeDispatch({
				type: 'currentMention',
				payload: mentionChanges.length > 0 ? mentionChanges[0] : undefined,
			});
		} else {
			return composeDispatch({
				type: 'currentMention',
				payload: undefined,
			});
		}
	};

	if (!matches) {
		return (
			<ThemeText variant={'textRedUnderline'} size={'md_16'}>
				{text}
			</ThemeText>
		);
	}
	matches.forEach((match, index) => {
		// push plain text that comes before each link or hashtag or mention
		if (match.index > lastIndex) {
			elements.push(
				<ThemeText key={`text-${index}`} size={'md_16'}>
					{text.slice(lastIndex, match.index)}
				</ThemeText>,
			);
		}

		// push each link or hashtag or mention
		elements.push(
			<ThemeText
				key={`link-${index}`}
				onPress={() => {}}
				variant="textPrimary"
				className="text-patchwork-primary dark:text-patchwork-soft-primary"
				size={'md_16'}
			>
				{match.raw}
			</ThemeText>,
		);

		lastIndex = match.lastIndex;
	});

	// add remaining plain text after all link or mention or hashtag are rendered
	if (lastIndex < text.length) {
		elements.push(
			<ThemeText key="remaining-text" size={'md_16'}>
				{text.slice(lastIndex)}
			</ThemeText>,
		);
	}

	return <ThemeText size={'md_16'}>{elements}</ThemeText>;
};
