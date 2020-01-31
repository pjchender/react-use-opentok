import { renderHook, act } from '@testing-library/react-hooks';
import useSessionEventHandler from './use-session-event-handler';
import reactUseOpentok from './../index';
import { MOCK_CREDENTIALS } from './../__mocks__/mockData';
import sessionEvent from './../__mocks__/mockEventEmitter';

describe('test useSessionEventHandler', () => {
  it('test for handle connectionCreated with correct parameters', () => {
    // START - initial session
    const { result: reactUseOpentokResult } = renderHook(() =>
      reactUseOpentok()
    );
    let [
      opentokProps,
      opentokMethods,
      setCredentials,
    ] = reactUseOpentokResult.current;
    act(() => setCredentials(MOCK_CREDENTIALS));

    [
      opentokProps,
      opentokMethods,
      setCredentials,
    ] = reactUseOpentokResult.current;
    expect(opentokProps.session).toBeDefined();
    // END - initial session

    // NOTICE: remove all event listeners registered when rendering reactUseOpenTok
    sessionEvent.removeAllListeners('connectionCreated');
    const handleConnectionCreated = jest.fn();
    expect(handleConnectionCreated).not.toHaveBeenCalled();

    renderHook(() =>
      useSessionEventHandler(
        'connectionCreated',
        handleConnectionCreated,
        opentokProps.session
      )
    );

    act(() => opentokProps.session.dispatch('connectionCreated'));
    expect(handleConnectionCreated).toHaveBeenCalledTimes(1);
  });

  it('handle incorrect event type', () => {
    // START - initial session
    const { result: reactUseOpentokResult } = renderHook(() =>
      reactUseOpentok()
    );
    let [
      opentokProps,
      opentokMethods,
      setCredentials,
    ] = reactUseOpentokResult.current;

    act(() => setCredentials(MOCK_CREDENTIALS));

    [
      opentokProps,
      opentokMethods,
      setCredentials,
    ] = reactUseOpentokResult.current;
    expect(opentokProps.session).toBeDefined();
    // END - initial session

    // NOTICE: remove all event listeners registered when rendering reactUseOpenTok
    sessionEvent.removeAllListeners('connectionCreated');
    const handleConnectionCreated = jest.fn();

    const { result } = renderHook(() =>
      useSessionEventHandler(
        'THIS_EVENT_TYPE_IS_NOT_SUPPORTED',
        handleConnectionCreated,
        opentokProps.session
      )
    );

    act(() => opentokProps.session.dispatch('connectionCreated'));

    expect(() => result.current).toThrow();
  });

  it('handle incorrect eventHandler', () => {
    // START - initial session
    const { result: reactUseOpentokResult } = renderHook(() =>
      reactUseOpentok()
    );
    let [
      opentokProps,
      opentokMethods,
      setCredentials,
    ] = reactUseOpentokResult.current;
    act(() => setCredentials(MOCK_CREDENTIALS));

    [
      opentokProps,
      opentokMethods,
      setCredentials,
    ] = reactUseOpentokResult.current;
    expect(opentokProps.session).toBeDefined();
    // END - initial session

    // NOTICE: remove all event listeners registered when rendering reactUseOpenTok
    sessionEvent.removeAllListeners('connectionCreated');
    const handleConnectionCreated = 'THIS_EVENT_HANDLER_IS_NOT_FUNCTION';

    const { result } = renderHook(() =>
      useSessionEventHandler(
        'connectionCreated',
        handleConnectionCreated,
        opentokProps.session
      )
    );

    act(() => opentokProps.session.dispatch('connectionCreated'));

    expect(() => result.current).toThrow();
  });
});
