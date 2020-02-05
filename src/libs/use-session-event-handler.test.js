import { renderHook, act } from '@testing-library/react-hooks';
import useSessionEventHandler from './use-session-event-handler';
import reactUseOpentok from './../index';
import { MOCK_CREDENTIALS } from './../__mocks__/mockData';
import sessionEvent from './../__mocks__/mockEventEmitter';

describe('test useSessionEventHandler', () => {
  it('test for handle connectionCreated with correct parameters', async () => {
    const { result } = renderHook(() => reactUseOpentok());
    let [opentokProps, opentokMethods] = result.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods] = result.current;

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

  it('handle incorrect event type', async () => {
    const { result: reactUseOpentokResult } = renderHook(() =>
      reactUseOpentok()
    );
    let [opentokProps, opentokMethods] = reactUseOpentokResult.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));
    [opentokProps, opentokMethods] = reactUseOpentokResult.current;

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

  it('handle incorrect eventHandler', async () => {
    const { result: reactUseOpentokResult } = renderHook(() =>
      reactUseOpentok()
    );
    let [opentokProps, opentokMethods] = reactUseOpentokResult.current;
    await act(() => opentokMethods.initSession(MOCK_CREDENTIALS));

    [opentokProps, opentokMethods] = reactUseOpentokResult.current;
    expect(opentokProps.session).toBeDefined();

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
