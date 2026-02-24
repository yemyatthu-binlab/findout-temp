import { renderHook, act } from '@testing-library/react-native';
import { useCommunityStream } from '../useCommunityStream';
import { useAuthStore } from '@/store/auth/authStore';

// Mock the auth store
jest.mock('@/store/auth/authStore', () => ({
	useAuthStore: {
		getState: jest.fn(),
	},
}));

// Type for the WebSocket mock instance
type MockWebSocket = {
	url: string;
	onopen: (() => void) | null;
	onmessage: ((event: { data: string }) => void) | null;
	onclose: (() => void) | null;
	close: jest.Mock;
	send: jest.Mock;
};

describe('useCommunityStream', () => {
	let mockWebSocketInstances: MockWebSocket[] = [];
	const mockOnNewStatus = jest.fn();
	const mockToken = 'mock-token';
	const mockInstance = 'https://mastodon.social';

	// Helper to get the mocked WebSocket instance
	const createMockWebSocket = (url: string) => {
		const instance: MockWebSocket = {
			url,
			onopen: null,
			onmessage: null,
			onclose: null,
			close: jest.fn(),
			send: jest.fn(),
		};
		mockWebSocketInstances.push(instance);
		return instance;
	};

	beforeAll(() => {
		// Mock the global WebSocket
		global.WebSocket = jest
			.fn()
			.mockImplementation(createMockWebSocket) as unknown as typeof WebSocket;
	});

	beforeEach(() => {
		jest.clearAllMocks();
		mockWebSocketInstances = [];
		(useAuthStore.getState as jest.Mock).mockReturnValue({
			mastodon: { token: mockToken },
			userOriginInstance: mockInstance,
		});
	});

	// Helper to get the last created instance
	const getLastMockWebSocket = () => {
		if (mockWebSocketInstances.length === 0) {
			throw new Error('No WebSocket instances created');
		}
		return mockWebSocketInstances[mockWebSocketInstances.length - 1];
	};

	it('should connect to WebSocket on mount when autoConnect is true', () => {
		const streamName = 'public:local';

		renderHook(() =>
			useCommunityStream({
				onNewStatus: mockOnNewStatus,
				autoConnect: true,
				streamName,
			}),
		);

		const expectedDomain = 'mastodon.social';
		const expectedUrl = `wss://${expectedDomain}/api/v1/streaming/?access_token=${mockToken}&stream=${streamName}`;

		expect(global.WebSocket).toHaveBeenCalledTimes(1);
		expect(global.WebSocket).toHaveBeenCalledWith(expectedUrl);
	});

	it('should NOT connect to WebSocket on mount when autoConnect is false', () => {
		renderHook(() =>
			useCommunityStream({
				onNewStatus: mockOnNewStatus,
				autoConnect: false,
			}),
		);

		expect(global.WebSocket).not.toHaveBeenCalled();
	});

	it('should disconnect from WebSocket on unmount', () => {
		const { unmount } = renderHook(() =>
			useCommunityStream({
				onNewStatus: mockOnNewStatus,
				autoConnect: true,
			}),
		);

		const ws = getLastMockWebSocket();
		expect(ws.close).not.toHaveBeenCalled();

		unmount();

		expect(ws.close).toHaveBeenCalledTimes(1);
	});

	it('should handle incoming statuses correctly', () => {
		renderHook(() =>
			useCommunityStream({
				onNewStatus: mockOnNewStatus,
				autoConnect: true,
			}),
		);

		const ws = getLastMockWebSocket();

		// Simulate WebSocket open
		act(() => {
			ws.onopen?.();
		});

		const statusPayload = { id: '123', content: 'Hello World' };
		const eventData = {
			event: 'update',
			payload: JSON.stringify(statusPayload),
		};

		// Simulate incoming message
		act(() => {
			ws.onmessage?.({ data: JSON.stringify(eventData) });
		});

		expect(mockOnNewStatus).toHaveBeenCalledWith(statusPayload);
	});

	it('should ignore non-update events', () => {
		renderHook(() =>
			useCommunityStream({
				onNewStatus: mockOnNewStatus,
				autoConnect: true,
			}),
		);

		const ws = getLastMockWebSocket();

		const eventData = {
			event: 'delete',
			payload: '123',
		};

		act(() => {
			ws.onmessage?.({ data: JSON.stringify(eventData) });
		});

		expect(mockOnNewStatus).not.toHaveBeenCalled();
	});

	it('should handle JSON parse errors gracefully', () => {
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		renderHook(() =>
			useCommunityStream({
				onNewStatus: mockOnNewStatus,
				autoConnect: true,
			}),
		);

		const ws = getLastMockWebSocket();

		act(() => {
			// Send invalid JSON
			ws.onmessage?.({ data: 'invalid json' });
		});

		expect(mockOnNewStatus).not.toHaveBeenCalled();
		expect(consoleSpy).toHaveBeenCalledWith(
			'Stream parse error:',
			expect.any(Error),
		);

		consoleSpy.mockRestore();
	});

	it('should reconnect when streamName changes', () => {
		const { rerender } = renderHook(
			({ streamName }) =>
				useCommunityStream({
					onNewStatus: mockOnNewStatus,
					autoConnect: true,
					streamName,
				}),
			{
				initialProps: { streamName: 'public' },
			},
		);

		expect(global.WebSocket).toHaveBeenCalledTimes(1);
		expect(global.WebSocket).toHaveBeenCalledWith(
			expect.stringContaining('stream=public'),
		);

		const firstWs = mockWebSocketInstances[0];

		// Rerender with new stream name
		rerender({ streamName: 'user' });

		expect(global.WebSocket).toHaveBeenCalledTimes(2);
		expect(global.WebSocket).toHaveBeenCalledWith(
			expect.stringContaining('stream=user'),
		);

		// Verify first connection was closed
		expect(firstWs.close).toHaveBeenCalled();

		// Verify we have a second instance
		expect(mockWebSocketInstances.length).toBe(2);
	});

	it('should expose connect and disconnect methods', () => {
		const { result } = renderHook(() =>
			useCommunityStream({
				onNewStatus: mockOnNewStatus,
				autoConnect: false,
			}),
		);

		expect(global.WebSocket).not.toHaveBeenCalled();

		// Manually connect
		act(() => {
			result.current.connect();
		});

		expect(global.WebSocket).toHaveBeenCalledTimes(1);

		const ws = getLastMockWebSocket();

		// Manually disconnect
		act(() => {
			result.current.disconnect();
		});

		expect(ws.close).toHaveBeenCalledTimes(1);
	});
});
