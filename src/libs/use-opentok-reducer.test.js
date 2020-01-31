import { renderHook, act } from '@testing-library/react-hooks';
import useOpenTokReducer from './use-opentok-reducer';
import {
  MOCK_CREDENTIALS,
  MOCK_STREAM,
  MOCK_PUBLISHER,
  MOCK_INIT_PUBLISHER,
  MOCK_SUBSCRIBER,
  MOCK_CONNECTION,
} from './../__mocks__/mockData';

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
      setCredentials(MOCK_CREDENTIALS);
    });

    const [state] = result.current;
    const { apiKey, sessionId, token } = state;

    expect({
      apiKey,
      sessionId,
      token,
    }).toEqual(MOCK_CREDENTIALS);
  });

  test('addConnection and removeConnection', () => {
    const { id, connectionId } = MOCK_CONNECTION;
    const { result } = renderHook(() => useOpenTokReducer());
    const [initialState, actions] = result.current;
    const { addConnection, removeConnection } = actions;
    const initialConnections = initialState.connections;

    expect(initialConnections).toEqual([]);

    act(() => {
      addConnection({
        id,
        connectionId,
      });
    });

    const [stateAfterAddConnection] = result.current;

    expect(stateAfterAddConnection.connections.length).toBe(
      initialConnections.length + 1
    );

    act(() => {
      removeConnection({
        id,
        connectionId,
      });
    });

    const [stateAfterRemoveConnection] = result.current;

    expect(stateAfterRemoveConnection.connections.length).toBe(
      initialConnections.length
    );
  });

  test('addStream and removeStream', () => {
    const { id, streamId } = MOCK_STREAM;
    const { result } = renderHook(() => useOpenTokReducer());
    const [initialState, actions] = result.current;
    const { addStream, removeStream } = actions;
    const initialStreams = initialState.streams;

    expect(initialStreams).toEqual([]);

    act(() => {
      addStream({
        id,
        streamId,
      });
    });

    const [stateAfterAddStream] = result.current;

    expect(stateAfterAddStream.streams.length).toBe(initialStreams.length + 1);

    act(() => {
      removeStream({
        id,
        streamId,
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
        name: MOCK_INIT_PUBLISHER.name,
        publisher: MOCK_PUBLISHER,
      });
    });

    const [stateAfterSetPublisher] = result.current;

    expect(stateAfterSetPublisher.publisher).toEqual({
      [MOCK_INIT_PUBLISHER.name]: expect.any(Object),
    });

    act(() => {
      removePublisher({
        name: MOCK_INIT_PUBLISHER.name,
      });
    });

    const [stateAfterRemovePublisher] = result.current;

    expect(stateAfterRemovePublisher.publisher).toEqual({
      [MOCK_INIT_PUBLISHER.name]: null,
    });
  });

  test('addSubscriber and removeSubscriber', () => {
    const { result } = renderHook(() => useOpenTokReducer());
    const [initialState, actions] = result.current;
    const { addSubscriber, removeSubscriber } = actions;
    const initialSubscribers = initialState.subscribers;

    expect(initialSubscribers).toEqual([]);

    act(() => {
      addSubscriber(MOCK_SUBSCRIBER);
    });

    const [stateAfterAddSubscriber] = result.current;

    expect(stateAfterAddSubscriber.subscribers.length).toBe(
      initialSubscribers.length + 1
    );

    act(() => {
      removeSubscriber(MOCK_SUBSCRIBER);
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
        connectionId: MOCK_CONNECTION.connectionId,
        isSessionConnected: true,
      });
    });

    const [stateAfterUpdate] = result.current;

    expect(stateAfterUpdate.isSessionConnected).toBeTruthy();
    expect(stateAfterUpdate.connectionId).toBe(MOCK_CONNECTION.connectionId);
  });
});
