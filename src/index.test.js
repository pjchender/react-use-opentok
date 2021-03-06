import reactUseOpentok from './';
import { renderHook, act } from '@testing-library/react-hooks';
import {
  MOCK_CREDENTIALS,
  MOCK_STREAM,
  MOCK_CONNECTION,
  MOCK_INIT_PUBLISHER,
  MOCK_SIGNAL,
} from './__mocks__/mockData';

describe('session initialization and connection', () => {
  it('initSession', async () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;

    expect(opentokProps.session).toBeUndefined();
    expect(opentokProps.isSessionInitialized).toBeFalsy();
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));

    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps.session).toBeDefined();
    expect(opentokProps.isSessionInitialized).toBeTruthy();
  });

  it('connectSession', async () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;

    try {
      await act(() => opentokMethods.connectSession(MOCK_CREDENTIALS.token));
    } catch (error) {
      expect(error).toMatch(/session/);
    }

    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));

    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps.isSessionConnected).toBeFalsy();
    expect(opentokProps.connectionId).toBeUndefined();

    try {
      await act(() => opentokMethods.connectSession());
    } catch (error) {
      expect(error).toMatch(/token/);
    }

    [opentokProps, opentokMethods] = result.current;
    await act(() =>
      opentokMethods.connectSession(
        MOCK_CREDENTIALS.token,
        opentokProps.session
      )
    );
    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps.isSessionConnected).toBeTruthy();
    expect(opentokProps.connectionId).toEqual(expect.any(String));
  });

  it('initSessionAndConnect', async () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    // expect(1).toBe(1);
    expect(opentokProps.session).toBeUndefined();
    expect(opentokProps.isSessionConnected).toBeFalsy();
    expect(opentokProps.connectionId).toBeUndefined();

    await act(() => opentokMethods.initSessionAndConnect(MOCK_CREDENTIALS));
    // [opentokProps, opentokMethods] = result.current;

    // expect(opentokProps.session).toBeDefined();
    // expect(opentokProps.isSessionConnected).toBeTruthy();
    // expect(opentokProps.connectionId).toEqual(expect.any(String));
  });
});

describe('session methods after initialization', () => {
  it('connectSession, disconnectSession', async () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));

    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps).toMatchObject({
      session: {
        connection: null,
      },
      isSessionConnected: false,
      connectionId: undefined,
    });

    await act(() =>
      opentokMethods.connectSession(
        MOCK_CREDENTIALS.token,
        opentokProps.session
      )
    );
    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps).toMatchObject({
      isSessionConnected: true,
      connectionId: expect.any(String),
    });

    act(() => opentokMethods.disconnectSession());
    [opentokProps, opentokMethods] = result.current;

    expect(opentokProps).toMatchObject({
      isSessionConnected: false,
      connectionId: null,
    });
  });

  it('publish, unpublish', async () => {
    const { name, element, options } = MOCK_INIT_PUBLISHER;
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods] = result.current;

    expect(opentokProps).toMatchObject({
      publisher: {},
      streams: [],
    });

    // publish
    await act(() =>
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
    expect(() =>
      act(() =>
        opentokMethods.publish({
          name,
          element,
          options,
        })
      )
    ).toThrow();

    // unpublish
    expect(() =>
      act(() => opentokMethods.unpublish({ name: 'foo' }))
    ).toThrow();

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

  it('subscribe, unsubscribe', async () => {
    const { name, element, options } = MOCK_INIT_PUBLISHER;
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods] = result.current;

    await act(() =>
      opentokMethods.publish({
        name,
        element,
        options,
      })
    );
    [opentokProps, opentokMethods] = result.current;

    expect(opentokProps).toMatchObject({
      subscribers: [],
    });
    expect(opentokProps.subscribers.length).toBe(0);
    const stream = opentokProps.publisher[name].stream;

    // subscribe
    act(() => {
      opentokMethods.subscribe({
        stream,
        element: 'subscriber',
      });
      return undefined;
    });

    [opentokProps, opentokMethods] = result.current;

    expect(opentokProps.subscribers.length).toBe(1);

    // unsubscribe
    act(() =>
      opentokMethods.unsubscribe({
        stream,
      })
    );
    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps.subscribers.length).toBe(0);
  });

  it('sendSignal with to and type', async () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    expect(() => act(() => opentokMethods.sendSignal(MOCK_SIGNAL))).toThrow();

    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods] = result.current;

    await act(() =>
      opentokMethods.connectSession(
        MOCK_CREDENTIALS.token,
        opentokProps.session
      )
    );
    [opentokProps, opentokMethods] = result.current;

    // register signal event
    const handleSignal = jest.fn((e) => e);
    act(() => opentokProps.session.on('signal', handleSignal));
    expect(handleSignal).not.toHaveBeenCalled();

    // dispatch signal event
    [opentokProps, opentokMethods] = result.current;
    act(() => opentokMethods.sendSignal(MOCK_SIGNAL));

    expect(handleSignal).toHaveBeenCalledTimes(1);
    expect(handleSignal).toHaveBeenCalledWith({
      type: MOCK_SIGNAL.type,
      data: MOCK_SIGNAL.data,
      to: MOCK_SIGNAL.to,
    });
  });

  it('sendSignal without to and type', async () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    const { to, type, ...mockSignalWithoutTypeAndTo } = MOCK_SIGNAL;

    expect(() =>
      act(() => opentokMethods.sendSignal(mockSignalWithoutTypeAndTo))
    ).toThrow();

    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods] = result.current;

    await act(() =>
      opentokMethods.connectSession(
        MOCK_CREDENTIALS.token,
        opentokProps.session
      )
    );
    [opentokProps, opentokMethods] = result.current;

    // register signal event
    const handleSignal = jest.fn((e) => e);
    act(() => opentokProps.session.on('signal', handleSignal));
    expect(handleSignal).not.toHaveBeenCalled();

    // dispatch signal event
    [opentokProps, opentokMethods] = result.current;
    act(() => opentokMethods.sendSignal(mockSignalWithoutTypeAndTo));

    expect(handleSignal).toHaveBeenCalledTimes(1);
    expect(handleSignal).toHaveBeenCalledWith({
      data: MOCK_SIGNAL.data,
    });
  });
});

describe('publisher initialization and remove', () => {
  it('initPublisher', async () => {
    const { name, element, options } = MOCK_INIT_PUBLISHER;
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods] = result.current;

    await act(() =>
      opentokMethods.initPublisher({
        name,
        element,
        options,
      })
    );
    [opentokProps, opentokMethods] = result.current;

    expect(opentokProps).toMatchObject({
      publisher: opentokProps.publisher,
    });

    // create a publisher already exist
    try {
      await act(() =>
        opentokMethods.initPublisher({
          name,
          element,
          options,
        })
      );
    } catch (error) {
      expect(error);
    }
  });

  it('removePublisher', async () => {
    const { name, element, options } = MOCK_INIT_PUBLISHER;
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods] = result.current;

    // remove a publisher not existed
    try {
      await act(() =>
        opentokMethods.removePublisher({
          name,
        })
      );
    } catch (error) {
      expect(error);
    }

    // init a publisher
    await act(() =>
      opentokMethods.initPublisher({
        name,
        element,
        options,
      })
    );

    [opentokProps, opentokMethods] = result.current;

    // remove a publisher
    act(() =>
      opentokMethods.removePublisher({
        name,
      })
    );

    [opentokProps, opentokMethods] = result.current;

    expect(opentokProps.publisher[name]).toBeNull();
  });

  it('publish publisher', async () => {
    const { name, element, options } = MOCK_INIT_PUBLISHER;
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));

    // publish an existed publisher
    [opentokProps, opentokMethods] = result.current;
    try {
      await act(() =>
        opentokMethods.publishPublisher({
          name,
        })
      );
    } catch (error) {
      expect(error);
    }

    // init a publisher
    [opentokProps, opentokMethods] = result.current;
    await act(() =>
      opentokMethods.initPublisher({
        name,
        element,
        options,
      })
    );

    // publish a publisher
    [opentokProps, opentokMethods] = result.current;
    await act(() =>
      opentokMethods.publishPublisher({
        name,
      })
    );

    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps.publisher[name].stream).toEqual(MOCK_STREAM);
  });

  it('remove published publisher', async () => {
    const { name, element, options } = MOCK_INIT_PUBLISHER;
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));

    // init a publisher
    [opentokProps, opentokMethods] = result.current;
    await act(() =>
      opentokMethods.initPublisher({
        name,
        element,
        options,
      })
    );

    // publish a publisher
    [opentokProps, opentokMethods] = result.current;
    await act(() =>
      opentokMethods.publishPublisher({
        name,
      })
    );

    [opentokProps, opentokMethods] = result.current;
    // remove a published publisher
    try {
      await act(() =>
        opentokMethods.removePublisher({
          name,
        })
      );
    } catch (error) {
      expect(error);
    }
  });
});

describe('test session event handler', () => {
  it('handleConnectionCreated and handleConnectionDestroyed', async () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods] = result.current;

    // handleConnectionCreated
    expect(opentokProps.connections).toEqual([]);
    act(() =>
      opentokProps.session.dispatch('connectionCreated', {
        connection: MOCK_CONNECTION,
      })
    );
    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps.connections).toEqual([MOCK_CONNECTION]);

    // handleConnectionDestroyed
    act(() =>
      opentokProps.session.dispatch('connectionDestroyed', {
        connection: MOCK_CONNECTION,
      })
    );

    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps.connections).toEqual([]);
  });

  it('handleStreamCreated and handleStreamDestroyed', async () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));

    // handleStreamCreated
    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps.streams).toEqual([]);
    act(() =>
      opentokProps.session.dispatch('streamCreated', {
        stream: MOCK_STREAM,
      })
    );
    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps.streams).toEqual([MOCK_STREAM]);

    // handleStreamDestroyed
    act(() =>
      opentokProps.session.dispatch('streamDestroyed', {
        stream: MOCK_STREAM,
      })
    );

    [opentokProps, opentokMethods] = result.current;
    expect(opentokProps.streams).toEqual([]);
  });
});
