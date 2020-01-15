import { renderHook, act } from '@testing-library/react-hooks';
import useOpenTokReducer from './use-opentok-reducer';

const mockData = {
  apiKey: '46464646',

  id: '0cf8a620-4e82-4ced-8133-b13fb12c4a1a',
  sessionId: '1_MX40NjQ2MTY0Mn5',
  token: 'T1==cGFydG5lcl9pZD00NjQ2MT',

  publisherName: 'camera',
};

describe('test useOpenTokReducer', () => {
  test('setCredential', () => {
    const { result } = renderHook(() => useOpenTokReducer());
    const [preState, actions] = result.current;
    const { setCredentials } = actions;

    expect({
      apiKey: preState.apiKey,
      sessionId: preState.sessionId,
      token: preState.token,
    }).toEqual({
      apiKey: undefined,
      sessionId: undefined,
      token: undefined,
    });

    act(() => {
      setCredentials({
        apiKey: mockData.apiKey,
        sessionId: mockData.sessionId,
        token: mockData.token,
      });
    });

    const [state] = result.current;
    const { apiKey, sessionId, token } = state;

    expect({
      apiKey,
      sessionId,
      token,
    }).toEqual({
      apiKey: mockData.apiKey,
      sessionId: mockData.sessionId,
      token: mockData.token,
    });
  });

  test('addConnection and removeConnection', () => {
    const { result } = renderHook(() => useOpenTokReducer());
    const [initialState, actions] = result.current;
    const { addConnection, removeConnection } = actions;
    const initialConnections = initialState.connections;

    expect(initialConnections).toEqual([]);

    act(() => {
      addConnection({
        id: mockData.id,
        connectionId: mockData.id,
      });
    });

    const [stateAfterAddConnection] = result.current;

    expect(stateAfterAddConnection.connections.length).toBe(
      initialConnections.length + 1
    );

    act(() => {
      removeConnection({
        id: mockData.id,
        connectionId: mockData.id,
      });
    });

    const [stateAfterRemoveConnection] = result.current;

    expect(stateAfterRemoveConnection.connections.length).toBe(
      initialConnections.length
    );
  });

  test('addStream and removeStream', () => {
    const { result } = renderHook(() => useOpenTokReducer());
    const [initialState, actions] = result.current;
    const { addStream, removeStream } = actions;
    const initialStreams = initialState.streams;

    expect(initialStreams).toEqual([]);

    act(() => {
      addStream({
        id: mockData.id,
        streamId: mockData.id,
      });
    });

    const [stateAfterAddStream] = result.current;

    expect(stateAfterAddStream.streams.length).toBe(initialStreams.length + 1);

    act(() => {
      removeStream({
        id: mockData.id,
        streamId: mockData.id,
      });
    });

    const [stateAfterRemoveStream] = result.current;

    expect(stateAfterRemoveStream.streams.length).toBe(initialStreams.length);
  });

  test('setPublisher and removePublisher', () => {
    const { result } = renderHook(() => useOpenTokReducer());
    const [initialState, actions] = result.current;
    const { setPublisher, removePublisher } = actions;
    const initialPublisher = initialState.publisher;

    expect(initialPublisher).toEqual({});

    act(() => {
      setPublisher({
        name: mockData.publisherName,
        publisher: {
          id: mockData.id,
        },
      });
    });

    const [stateAfterSetPublisher] = result.current;

    expect(stateAfterSetPublisher.publisher).toEqual({
      [mockData.publisherName]: expect.any(Object),
    });

    act(() => {
      removePublisher({
        name: mockData.publisherName,
      });
    });

    const [stateAfterRemovePublisher] = result.current;

    expect(stateAfterRemovePublisher.publisher).toEqual({
      [mockData.publisherName]: null,
    });
  });

  test('addSubscriber and removeSubscriber', () => {
    const { result } = renderHook(() => useOpenTokReducer());
    const [initialState, actions] = result.current;
    const { addSubscriber, removeSubscriber } = actions;
    const initialSubscribers = initialState.subscribers;

    expect(initialSubscribers).toEqual([]);

    act(() => {
      addSubscriber({
        id: mockData.id,
        streamId: mockData.id,
      });
    });

    const [stateAfterAddSubscriber] = result.current;

    expect(stateAfterAddSubscriber.subscribers.length).toBe(
      initialSubscribers.length + 1
    );

    act(() => {
      removeSubscriber({
        streamId: mockData.id,
      });
    });

    const [stateAfterRemoveSubscribe] = result.current;

    expect(stateAfterRemoveSubscribe.subscribers.length).toBe(
      initialSubscribers.length
    );
  });

  test('update', () => {
    const { result } = renderHook(() => useOpenTokReducer());
    const [initialState, actions] = result.current;
    const { update } = actions;

    expect(initialState.isSessionConnected).toBeFalsy();

    act(() => {
      update({
        connectionId: mockData.id,
        isSessionConnected: true,
      });
    });

    const [stateAfterUpdate] = result.current;

    expect(stateAfterUpdate.isSessionConnected).toBeTruthy();
    expect(stateAfterUpdate.connectionId).toBe(mockData.id);
  });
});
