import reactUseOpentok from './';
import { renderHook, act } from '@testing-library/react-hooks';
import {
  MOCK_CREDENTIALS,
  MOCK_STREAM,
  MOCK_CONNECTION,
  MOCK_INIT_PUBLISHER,
  MOCK_SIGNAL,
} from './__mocks__/mockData';

describe('session methods for initialization', () => {
  it('session will be initiated after setCredential', () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps.session).toBeUndefined();
    act(() => setCredentials(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps.session).toBeDefined();
  });
});

describe('session methods after initialization', () => {
  it('test for opentokMethods - connectSession, disconnectSession', () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods, setCredentials] = result.current;

    act(() => setCredentials(MOCK_CREDENTIALS));

    [opentokProps, opentokMethods, setCredentials] = result.current;

    expect(opentokProps).toMatchObject({
      session: {
        connection: null,
      },
      isSessionConnected: false,
      connectionId: undefined,
    });

    act(() => opentokMethods.connectSession());

    [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps).toMatchObject({
      isSessionConnected: true,
      connectionId: expect.any(String),
    });

    act(() => opentokMethods.disconnectSession());

    [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps).toMatchObject({
      isSessionConnected: false,
      connectionId: null,
    });
  });

  it('test for opentokMethods - publish, unpublish', () => {
    const { name, element, options } = MOCK_INIT_PUBLISHER;
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods, setCredentials] = result.current;

    // set credentials
    act(() => setCredentials(MOCK_CREDENTIALS));

    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps).toMatchObject({
      publisher: {},
      streams: [],
    });

    // publish
    act(() =>
      opentokMethods.publish({
        name,
        element,
        options,
      })
    );

    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps).toMatchObject({
      publisher: {
        [name]: expect.any(Object),
      },
      streams: expect.any(Array),
    });
    expect(opentokProps.streams.length).toBe(1);

    // unpublish
    act(() =>
      opentokMethods.unpublish({
        name,
      })
    );

    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps).toMatchObject({
      publisher: {
        [name]: null,
      },
    });
    expect(opentokProps.streams.length).toBe(0);
  });

  it('test for opentokMethods - subscribe, unsubscribe', () => {
    const { name, element, options } = MOCK_INIT_PUBLISHER;
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods, setCredentials] = result.current;

    // Start - setup
    act(() => setCredentials(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods, setCredentials] = result.current;
    act(() =>
      opentokMethods.publish({
        name,
        element,
        options,
      })
    );
    [opentokProps, opentokMethods, setCredentials] = result.current;
    // End - setup

    expect(opentokProps).toMatchObject({
      subscribers: [],
    });
    expect(opentokProps.subscribers.length).toBe(0);
    const stream = opentokProps.publisher[name].stream;

    // subscribe
    act(() =>
      opentokMethods.subscribe({
        stream,
        element: 'subscriber',
      })
    );
    [opentokProps, opentokMethods, setCredentials] = result.current;

    expect(opentokProps.subscribers.length).toBe(1);

    // unsubscribe
    act(() =>
      opentokMethods.unsubscribe({
        stream,
      })
    );
    [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps.subscribers.length).toBe(0);
  });

  it('test for opentokMethods - sendSignal', () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods, setCredentials] = result.current;

    // START: setup
    act(() => setCredentials(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods, setCredentials] = result.current;
    act(() => opentokMethods.connectSession());
    [opentokProps, opentokMethods, setCredentials] = result.current;
    // END: setup

    // register signal event
    const handleSignal = jest.fn(e => e);
    act(() => opentokProps.session.on('signal', handleSignal));
    expect(handleSignal).not.toHaveBeenCalled();

    // dispatch signal event
    [opentokProps, opentokMethods, setCredentials] = result.current;
    act(() => opentokMethods.sendSignal(MOCK_SIGNAL));

    expect(handleSignal).toHaveBeenCalledTimes(1);
    expect(handleSignal).toHaveBeenCalledWith({
      type: MOCK_SIGNAL.type,
      data: MOCK_SIGNAL.data,
    });
  });
});

describe('test session event handler', () => {
  it('handleConnectionCreated and handleConnectionDestroyed', () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods, setCredentials] = result.current;
    act(() => setCredentials(MOCK_CREDENTIALS));

    // handleConnectionCreated
    [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps.connections).toEqual([]);
    act(() =>
      opentokProps.session.dispatch('connectionCreated', {
        connection: MOCK_CONNECTION,
      })
    );
    [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps.connections).toEqual([MOCK_CONNECTION]);

    // handleConnectionDestroyed
    act(() =>
      opentokProps.session.dispatch('connectionDestroyed', {
        connection: MOCK_CONNECTION,
      })
    );

    [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps.connections).toEqual([]);
  });

  it('handleStreamCreated and handleStreamDestroyed', () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods, setCredentials] = result.current;
    act(() => setCredentials(MOCK_CREDENTIALS));

    // handleStreamCreated
    [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps.streams).toEqual([]);
    act(() =>
      opentokProps.session.dispatch('streamCreated', {
        stream: MOCK_STREAM,
      })
    );
    [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps.streams).toEqual([MOCK_STREAM]);

    // handleStreamDestroyed
    act(() =>
      opentokProps.session.dispatch('streamDestroyed', {
        stream: MOCK_STREAM,
      })
    );

    [opentokProps, opentokMethods, setCredentials] = result.current;
    expect(opentokProps.streams).toEqual([]);
  });
});
