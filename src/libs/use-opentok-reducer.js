import { useReducer, useMemo } from 'react';

const initialState = {
  // credentials
  apiKey: undefined,
  sessionId: undefined,
  token: undefined,

  // connection info
  connectionId: undefined,
  isSessionConnected: false,

  // connected data
  session: undefined,
  connections: [],
  streams: [],
  subscribers: [],
  publisher: {},
};

// ACTION TYPE
const UPDATE = 'UPDATE';
const SET_CREDENTIALS = 'SET_CREDENTIALS';
const ADD_CONNECTION = 'ADD_CONNECTION';
const REMOVE_CONNECTION = 'REMOVE_CONNECTION';
const ADD_STREAM = 'ADD_STREAM';
const REMOVE_STREAM = 'REMOVE_STREAM';
const SET_PUBLISHER = 'SET_PUBLISHER';
const REMOVE_PUBLISHER = 'REMOVE_PUBLISHER';
const ADD_SUBSCRIBER = 'ADD_SUBSCRIBER';
const REMOVE_SUBSCRIBER = 'REMOVE_SUBSCRIBER';

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    // CONNECT_SUCCESS
    case UPDATE: {
      return {
        ...state,
        ...payload,
      };
    }
    case SET_CREDENTIALS: {
      const { apiKey, sessionId, token } = payload;
      return {
        ...state,
        apiKey,
        sessionId,
        token,
      };
    }
    case ADD_CONNECTION: {
      return {
        ...state,
        connections: [...state.connections, payload],
      };
    }
    case REMOVE_CONNECTION: {
      return {
        ...state,
        connections: [
          ...state.connections.filter(
            c => c.connectionId !== payload.connectionId
          ),
        ],
      };
    }
    case ADD_STREAM: {
      return {
        ...state,
        streams: [...state.streams, payload],
      };
    }
    case REMOVE_STREAM: {
      return {
        ...state,
        streams: [
          ...state.streams.filter(s => s.streamId !== payload.streamId),
        ],
      };
    }
    case SET_PUBLISHER: {
      const { name, publisher } = payload;
      return {
        ...state,
        publisher: {
          ...state.publisher,
          [name]: publisher,
        },
      };
    }
    case REMOVE_PUBLISHER: {
      const { name } = payload;
      return {
        ...state,
        publisher: {
          ...state.publisher,
          [name]: null,
        },
      };
    }
    case ADD_SUBSCRIBER: {
      return {
        ...state,
        subscribers: [...state.subscribers, payload],
      };
    }
    case REMOVE_SUBSCRIBER: {
      return {
        ...state,
        subscribers: [
          ...state.subscribers.filter(s => s.streamId !== payload.streamId),
        ],
      };
    }
    default:
      return state;
  }
};

const useOpenTokReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const action = useMemo(
    () => ({
      update(payload) {
        dispatch({
          type: UPDATE,
          payload,
        });
      },
      setCredentials({ apiKey, sessionId, token }) {
        dispatch({
          type: SET_CREDENTIALS,
          payload: {
            apiKey,
            sessionId,
            token,
          },
        });
      },
      addConnection(connection) {
        dispatch({
          type: ADD_CONNECTION,
          payload: connection,
        });
      },
      removeConnection(connection) {
        dispatch({
          type: REMOVE_CONNECTION,
          payload: connection,
        });
      },
      addStream(stream) {
        dispatch({
          type: ADD_STREAM,
          payload: stream,
        });
      },
      removeStream(stream) {
        dispatch({
          type: REMOVE_STREAM,
          payload: stream,
        });
      },
      setPublisher({ name, publisher }) {
        dispatch({
          type: SET_PUBLISHER,
          payload: { name, publisher },
        });
      },
      removePublisher({ name }) {
        dispatch({
          type: REMOVE_PUBLISHER,
          payload: { name },
        });
      },
      addSubscriber(subscriber) {
        dispatch({
          type: ADD_SUBSCRIBER,
          payload: subscriber,
        });
      },
      removeSubscriber(subscriber) {
        dispatch({
          type: REMOVE_SUBSCRIBER,
          payload: subscriber,
        });
      },
    }),
    []
  );

  return [state, action];
};

export default useOpenTokReducer;
