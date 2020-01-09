import React, {
  useEffect,
  useLayoutEffect,
  useCallback,
  useReducer,
} from 'react';
import OpenTok from '@opentok/client';

const defaultOptions = {
  apiKey: undefined,
  sessionId: undefined,
  isSessionConnected: false,
  token: undefined,
  session: undefined,
  connections: [],
  strems: [],
};
const reducer = (state, action) => {
  const {
    type,
    payload,
  } = action;
  switch (type) {
    case 'UPDATE':
      return {
        ...state,
        ...payload,
      };
    case 'ADD_CONNECTION':
      return {
        ...state,
        connections: [...state.connections, payload],
      };
    case 'REMOVE_CONNECTION':
      return {
        ...state,
        connections: [
          ...state.connections.filter(c => c.id !== payload.id),
        ],
      };
    case 'ADD_STREAM':
      return {
        ...state,
        streams: [
          ...state.streams,
          payload,
        ],
      };
    case 'REMOVE_STREAM':
      return {
        ...state,
        streams: [
          ...state.streams.filter(s => s.id !== payload.id),
        ],
      };
    default:
      return state;
  }
};
export function useOpenTok(options) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultOptions,
    ...options,
  });
  const {
    session,
    apiKey,
    sessionId,
    token,
  } = state;
  if (!session && apiKey && sessionId) {
    dispatch({
      type: 'UPDATE',
      payload: {
        session: OpenTok.initSession(apiKey, sessionId)
      },
    })
  }

  const onConnectionCreated = useCallback((e) => {
    dispatch({
      type: 'ADD_CONNECTION',
      payload: e.connection,
    });
  }, []);
  useSessionEventHandler('connectionCreated', onConnectionCreated, session);
  const onConnectionDestroyed = useCallback((e) => {
    dispatch({
      type: 'REMOVE_CONNECTION',
      payload: e.connection,
    });
  }, []);
  useSessionEventHandler('connectionDestroyed', onConnectionDestroyed, session);
  const onStreamCreated = useCallback((e) => {
    dispatch({
      type: 'ADD_STREAM',
      payload: e.stream,
    });
  }, []);
  useSessionEventHandler('streamCreated', onStreamCreated, session);
  const onStreamDestroyed = useCallback((e) => {
    dispatch({
      type: 'REMOVE_STREAM',
      payload: e.stream,
    });
  }, []);
  useSessionEventHandler('streamCreated', onStreamDestroyed, session);
  useEffect(() => {
    if (session && token) {
      session.connect(token, (err) => {
        if (err) {
          console.error('Session connects error:', err);
          dispatch({
            type: 'UPDATE',
            payload: {
              isSessionConnected: false,
            },
          });
        } else {
          dispatch({
            type: 'UPDATE',
            payload: {
              isSessionConnected: true,
            },
          });
        }
      });
    }
  }, [session, token]);

  return state;
};

const events = [
  'archiveStarted',
  'archiveStopped',
  'connectionCreated',
  'connectionDestroyed',
  'sessionConnected',
  'sessionDisconnected',
  'sessionReconnected',
  'sessionReconnecting',
  'signal',
  'streamCreated',
  'streamDestroyed',
  'streamPropertyChanged',
];
function useSessionEventHandler(type, callback, session) {
  const isEventTypeSupported = events.some(e => type.startsWith(e));
  if (!isEventTypeSupported) {
    console.warn('The event type may NOT supported');
  }
  if (typeof callback !== 'function') {
    throw new Error('Incorrect value or type of callback');
  }

  useLayoutEffect(() => {
    const {
      sessionId,
    } = session || {};
    if (typeof sessionId !== 'string') {
      return;
    }

    session.on(type, callback);
    return () => {
      session.off(type, callback);
    };
  }, [session, type, callback]);
};
