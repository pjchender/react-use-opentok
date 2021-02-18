import { useCallback } from 'react';
import useOpenTokReducer from './libs/use-opentok-reducer';
import useSessionEventHandler from './libs/use-session-event-handler';
import OT from '@opentok/client';

// default options for subscribe and initPublisher
const defaultOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
};

const useOpenTok = () => {
  const [state, action] = useOpenTokReducer();

  const {
    isSessionConnected,

    session,
    subscribers,
    publisher,

    streams,
  } = state;

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

  const initSession = useCallback(
    ({ apiKey, sessionId, sessionOptions }) =>
      new Promise(resolve => {
        const session = OT.initSession(apiKey, sessionId, sessionOptions);
        action.update({ session, isSessionInitialized: true });
        resolve(session);
      }),
    [action]
  );

  const connectSession = useCallback(
    (token, sessionToConnect) =>
      new Promise((resolve, reject) => {
        if (!token) {
          return reject('[ReactUseOpenTok] token does not exist.');
        }

        if (!sessionToConnect) {
          return reject('[ReactUseOpenTok] session does not exist.');
        }

        sessionToConnect.connect(token, error => {
          if (error) {
            reject(error);
          } else {
            const connectionId = sessionToConnect.connection.connectionId;
            action.update({
              connectionId,
              isSessionConnected: true,
            });
            resolve(connectionId);
          }
        });
      }),
    [action]
  );

  const initSessionAndConnect = useCallback(
    async ({ apiKey, sessionId, token, sessionOptions }) => {
      const newSession = await initSession({
        apiKey,
        sessionId,
        sessionOptions,
      });

      await connectSession(token, newSession);
    },
    [connectSession, initSession]
  );

  const disconnectSession = useCallback(() => {
    session.disconnect();
    action.update({
      connectionId: null,
      isSessionConnected: false,
    });
  }, [action, session]);

  const initPublisher = useCallback(({
    name,
    element,
    options,
  }) => {
    if (publisher[name]) {
      throw new Error(`[ReactUseOpenTok] initPublisher: The publisher(${name}) is already existed`);
    }
    return new Promise((resolve, reject) => {
      const newPublisher = OT.initPublisher(
        element,
        { ...defaultOptions, ...options },
        (error) => {
          if (error) {
            reject(error);
          }
        }
      );
      action.setPublisher({
        name,
        publisher: newPublisher,
      });
      resolve(newPublisher);
    });
  }, [action, session, publisher]);

  const removePublisher = useCallback(({
    name,
  }) => {
    if (!publisher[name]) {
      throw new Error(`[ReactUseOpenTok] removePublisher: The publisher(${name}) is not existed`);
    }

    const published = streams.some((stream) => stream.streamId === publisher[name].stream.streamId);
    if (published) {
      throw new Error(`[ReactUseOpenTok] removePublisher: can NOT remove published publisher, please use unpublish instead.`);
    }

    publisher[name].destroy();
    action.removePublisher({ name });
  }, [action, streams, publisher]);

  const publishPublisher = useCallback(({
    name
  }) => {
    if (!publisher[name]) {
      throw new Error(`[ReactUseOpenTok] publishPublisher: The publisher(${name}) is not existed`);
    }

    return new Promise((resolve, reject) => {
      session.publish(publisher[name], error => {
        if (error) {
          reject(error);
        } else {
          action.addStream(publisher[name].stream);
          resolve(publisher[name].stream);
        }
      });
    });
  }, [action, session, publisher]);

  const publish = useCallback(
    ({ name, element, options }) => {
      if (publisher[name]) {
        throw new Error(`[ReactUseOpenTok] publish: The publisher(${name}) is already existed`);
      }

      return new Promise((resolve, reject) => {
        const newPublisher = OT.initPublisher(
          element,
          { ...defaultOptions, ...options },
          (error) => {
            if (error) {
              reject(error);
            }
          }
        );
        resolve(newPublisher);
      }).then((newPublisher) => {
        return new Promise((resolve, reject) => {
          session.publish(newPublisher, error => {
            if (error) {
              reject(error);
            } else {
              action.setPublisher({
                name,
                publisher: newPublisher,
              });
              action.addStream(newPublisher.stream);
              resolve(newPublisher.stream);
            }
          });
        });
      });
    },
    [action, publisher, session]
  );

  const unpublish = useCallback(
    ({ name }) => {
      if (!(publisher && publisher[name])) {
        throw new Error(`[ReactUseOpenTok] unpublish: publisher[${name}] is undefined`);
      }

      const stream = publisher && publisher[name] && publisher[name].stream;

      session.unpublish(publisher[name]);
      action.removePublisher({ name });
      action.removeStream(stream);
    },
    [action, publisher, session]
  );

  const subscribe = useCallback(
    ({ stream, element, options }) => {
      const subscriber = session.subscribe(stream, element, {
        ...defaultOptions,
        ...options,
      });

      action.addSubscriber(subscriber);
      return subscriber;
    },
    [action, session]
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

  const sendSignal = useCallback(
    ({ type, data, to, completionHandler }) => {
      if (!isSessionConnected) {
        throw new Error('[ReactUseOpenTok] sendSignal: Session is not connected');
      }

      let signal = {
        data,
        ...type && { type },
        ...to && { to },
      }

      session.signal(signal, error => {
        if (error) {
          throw new Error('[ReactUseOpenTok] sendSignal error: ' + error.message);
        } else if (typeof completionHandler === 'function') {
          completionHandler();
        }
      });
    },
    [isSessionConnected, session]
  );

  useSessionEventHandler('connectionCreated', handleConnectionCreated, session);
  useSessionEventHandler(
    'connectionDestroyed',
    handleConnectionDestroyed,
    session
  );
  useSessionEventHandler('streamCreated', handleStreamCreated, session);
  useSessionEventHandler('streamDestroyed', handleStreamDestroyed, session);

  return [
    state,
    {
      initSessionAndConnect,
      initSession,
      connectSession,
      disconnectSession,
      initPublisher,
      removePublisher,
      publishPublisher,
      publish,
      unpublish,
      subscribe,
      unsubscribe,
      sendSignal,
    },
  ];
};

export default useOpenTok;
