export interface Comment {
	id: string;
	username: string;
	avatar: string;
	text: string;
	timestamp: string;
	likes: number;
}

export const MOCK_COMMENTS: Comment[] = Array.from({ length: 15 }).map(
	(_, i) => ({
		id: `comment-${i}`,
		username: `user_${i + 1}`,
		avatar: `https://i.pravatar.cc/150?u=${i}`,
		text:
			i % 2 === 0
				? 'This is such an amazing video! I really learned a lot from this.'
				: 'Can you explain more about the second point? It was very interesting.',
		timestamp: `${i + 1}h ago`,
		likes: Math.floor(Math.random() * 100),
	}),
);
