import { useEffect, useCallback } from 'react';
import useOpenTokReducer from './libs/use-opentok-reducer';
import useSessionEventHandler from './libs/use-session-event-handler';
import OT from '@opentok/client';

const handleError = error => {
  if (error) {
    console.error('[HandleError]', error.message);
  }
};

// default options for subscribe and initPublisher
const defaultOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
};

const useOpenTok = () => {
  const [state, action] = useOpenTokReducer();

  const {
    apiKey,
    sessionId,
    token,

    session,
    subscribers,
    publisher,

    streams,
  } = state;

  const handleSessionDisconnected = useCallback(() => {
    window.location.reload();
  }, []);

  const handleConnectionCreated = useCallback(
    event => {
      action.addConnection(event.connection);
    },
    [action]
  );

  const handleConnectionDestroyed = useCallback(
    event => {
      action.removeConnection(event.connection);
    },
    [action]
  );

  const handleStreamCreated = useCallback(
    event => {
      action.addStream(event.stream);
    },
    [action]
  );

  const handleStreamDestroyed = useCallback(
    event => {
      action.removeStream(event.stream);
    },
    [action]
  );

  const connectSession = useCallback(() => {
    session.connect(token, error => {
      if (error) {
        handleError(error);
      } else {
        const connectionId = session.connection.connectionId;
        action.update({
          connectionId,
          isSessionConnected: true,
        });
        console.log('---[Session Connected]---');
      }
    });
  }, [action, session, token]);

  const disconnectSession = useCallback(() => {
    session.disconnect();
    action.update({
      connectionId: null,
      isSessionConnected: false,
    });
  }, [action, session]);

  const publish = useCallback(
    ({ name, element, options = defaultOptions }) => {
      if (publisher[name]) {
        console.warn(`The publisher(${name}) is already existed`);
        return;
      }

      const newPublisher = OT.initPublisher(element, options, handleError);

      session.publish(newPublisher, error => {
        if (error) {
          handleError(error);
        } else {
          action.setPublisher({
            name,
            publisher: newPublisher,
          });
          action.addStream(newPublisher.stream);
        }
      });
    },
    [action, publisher, session]
  );

  const unpublish = useCallback(
    ({ name }) => {
      if (!(publisher && publisher[name])) {
        console.error(`[unpublish] publisher[${name}] is undefined`);
        return;
      }

      const stream = publisher && publisher[name] && publisher[name].stream;

      session.unpublish(publisher[name]);
      action.removePublisher({ name });
      action.removeStream(stream);
    },
    [action, publisher, session]
  );

  const subscribe = useCallback(
    ({ stream, element }) => {
      const { streamId } = stream;
      const pickedStream = streams.find(s => s.streamId === streamId);

      const subscriber = session.subscribe(pickedStream, element, {
        ...defaultOptions,
      });

      action.addSubscriber(subscriber);
    },
    [action, session, streams]
  );

  const unsubscribe = useCallback(
    ({ stream }) => {
      const { streamId } = stream;
      const subscriber = subscribers.find(
        subscriber => subscriber.streamId === streamId
      );

      session.unsubscribe(subscriber);
      action.removeSubscriber(subscriber);
    },
    [action, session, subscribers]
  );

  useEffect(() => {
    if (!(apiKey && sessionId && token)) return;

    action.update({ session: OT.initSession(apiKey, sessionId) });
  }, [action, apiKey, sessionId, token]);

  useSessionEventHandler('connectionCreated', handleConnectionCreated, session);
  useSessionEventHandler(
    'connectionDestroyed',
    handleConnectionDestroyed,
    session
  );
  useSessionEventHandler('streamCreated', handleStreamCreated, session);
  useSessionEventHandler('streamDestroyed', handleStreamDestroyed, session);
  useSessionEventHandler(
    'sessionDisconnected',
    handleSessionDisconnected,
    session
  );

  return [
    state,
    {
      connectSession,
      disconnectSession,
      publish,
      unpublish,
      subscribe,
      unsubscribe,
    },
    action.setCredentials,
  ];
};

export default useOpenTok;
