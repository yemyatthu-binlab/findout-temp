import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth/authStore';

type UseStreamProps = {
	onNewStatus: (status: Patchwork.Status) => void;
	autoConnect?: boolean;
	streamName?: string;
};

type StreamEvent = {
	event: 'update' | 'delete';
	payload: string;
};

export const useCommunityStream = ({
	onNewStatus,
	autoConnect = true,
	streamName = 'public:local',
}: UseStreamProps) => {
	const ws = useRef<WebSocket | null>(null);
	const { mastodon, userOriginInstance } = useAuthStore.getState();
	const onNewStatusRef = useRef(onNewStatus);
	const domain = userOriginInstance.replace(/^https?:\/\//, '');

	useEffect(() => {
		onNewStatusRef.current = onNewStatus;
	}, [onNewStatus]);

	useEffect(() => {
		if (autoConnect) connect();
		return () => disconnect();
	}, [autoConnect, domain, streamName]);

	const connect = () => {
		if (ws.current) ws.current.close();
		const url = `wss://${domain}/api/v1/streaming/?access_token=${mastodon.token}&stream=${streamName}`;
		ws.current = new WebSocket(url);

		ws.current.onopen = () => {
			console.log(`Stream connected: ${streamName}`);
		};

		ws.current.onmessage = event => {
			try {
				const data: StreamEvent = JSON.parse(event.data);
				if (data.event === 'update') {
					const status: Patchwork.Status = JSON.parse(data.payload);
					onNewStatusRef.current(status);
				}
			} catch (e) {
				console.error('Stream parse error:', e);
			}
		};

		ws.current.onclose = () => {};
	};

	const disconnect = () => {
		ws.current?.close();
		ws.current = null;
	};

	return { connect, disconnect };
};
