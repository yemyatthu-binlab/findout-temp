import { View } from 'react-native';
import { cn } from '@/util/helper/twutil';
import { ThemeText } from '../../common/ThemeText/ThemeText';
import { extractMessage } from '@/util/helper/extractMessage';
import { cleanText } from '@/util/helper/cleanText';
import { removePrivateConvoHashtag } from '@/util/helper/handlePrivateConvoHashtag';
import { useNavigation } from '@react-navigation/native';

const MessageContent = ({
	item,
	isOwnMessage,
	showTimestamp,
}: {
	item: Patchwork.Status;
	isOwnMessage: boolean;
	showTimestamp: boolean;
}) => {
	const navigation = useNavigation();
	const message = removePrivateConvoHashtag(
		extractMessage(cleanText(item.content)),
	);
	const { parts, links } = extractLinks(message);

	const navigateToWebView = (url: string) => {
		navigation.navigate('WebViewer', { url });
	};

	if (parts.length > 0 && parts[0]?.trim() === '') return null;

	return (
		<View
			className={cn(
				'ml-2 px-4 rounded-xl',
				isOwnMessage
					? 'bg-patchwork-primary dark:bg-patchwork-primary-dark rounded-br-none'
					: 'bg-patchwork-light-100 dark:bg-patchwork-grey-70 rounded-bl-none',
				showTimestamp ? 'py-3' : 'py-3',
			)}
		>
			<ThemeText>
				{parts.map((part, index) => {
					const isLink = links.includes(part);
					return isLink ? (
						<ThemeText
							emojis={item.emojis}
							key={index}
							className={cn(
								' underline',
								isOwnMessage ? 'text-white dark:text-white' : 'text-blue-500',
							)}
							onPress={() => navigateToWebView(part)}
						>
							{part}
						</ThemeText>
					) : (
						<ThemeText
							emojis={item.emojis}
							key={index}
							className={isOwnMessage ? 'text-white dark:text-white' : ''}
						>
							{part}
						</ThemeText>
					);
				})}
			</ThemeText>
		</View>
	);
};
export default MessageContent;

// A utility function to find links in the text
const extractLinks = (text: string): { parts: string[]; links: string[] } => {
	const linkRegex = /(https?:\/\/[^\s]+)/g;
	const parts = text.split(linkRegex);
	const links = text.match(linkRegex) || [];
	return { parts, links };
};
