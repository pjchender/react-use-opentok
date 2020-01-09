import { useState, useEffect, useCallback } from 'react';
import OT from '@opentok/client';

const handleError = error => {
  if (error) {
    console.error('[HandleError]', error.message);
  }
};

const defaultPublisherOption = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
};

const useOpenTok = (
  { publisherElement, subscriberElement, screenSharingElement } = {
    publisherElement: 'publisher',
    subscriberElement: 'subscriber',
    screenSharingElement: 'screen-sharing',
  }
) => {
  const [credentials, setCredentials] = useState({});
  const [session, setSession] = useState(null);

  const [subscribers, setSubscribers] = useState([]);
  const [publisher, setPublisher] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  const [screenSharing, setScreenSharing] = useState(null);

  const [clientsInSession, setClientsInSession] = useState([]);
  const [publishersInSession, setPublishersInSession] = useState([]);

  const { token } = credentials;

  const handleSessionDisconnected = useCallback(() => {
    window.location.reload();
  }, []);

  const handleConnectionCreated = useCallback(event => {
    const connectionId = event.connection.connectionId;
    setClientsInSession(prevClients => [...prevClients, connectionId]);
  }, []);

  const handleConnectionDestroyed = useCallback(event => {
    const connectionId = event.connection.connectionId;
    setClientsInSession(prevClients =>
      prevClients.filter(client => client !== connectionId)
    );
  }, []);

  const handleStreamCreated = useCallback(event => {
    const connectionId = event.stream.connection.id;
    const streamId = event.stream.streamId;
    const stream = { ...event.stream };

    setPublishersInSession(prevPublishers => [
      ...prevPublishers,
      {
        connectionId,
        stream,
        streamId,
      },
    ]);
  }, []);

  const handleStreamDestroyed = useCallback(event => {
    const streamId = event.stream.streamId;
    setPublishersInSession(prevPublishers =>
      prevPublishers.filter(client => client.streamId !== streamId)
    );
  }, []);

  const connectSession = useCallback(() => {
    session.connect(token, error => {
      if (error) {
        handleError(error);
      } else {
        const connectionId = session.connection.connectionId;
        setConnectionId(connectionId);
        console.log('---[Session Connected]---');
      }
    });
  }, [session, token]);

  const disconnectSession = useCallback(() => {
    session.disconnect();
    setConnectionId(null);
  }, [session]);

  const publishToSession = useCallback(() => {
    // Initial Publisher
    const publisher = OT.initPublisher(
      publisherElement,
      {
        ...defaultPublisherOption,
      },
      handleError
    );

    // NOTICE: 一定要先 publish 後才能拿到 publisher.streamId
    session.publish(publisher, handleError);
    const stream = { ...publisher.stream };
    const streamId = publisher.streamId;

    setPublishersInSession(prevPublishers => [
      ...prevPublishers,
      {
        connectionId,
        stream,
        streamId,
      },
    ]);

    setPublisher(publisher);
  }, [connectionId, publisherElement, session]);

  const unpublishToSession = useCallback(() => {
    session.unpublish(publisher);

    setPublishersInSession(prevPublishers =>
      prevPublishers.filter(p => p.streamId !== publisher.streamId)
    );
    setPublisher(null);
  }, [publisher, session]);

  const publishScreenSharing = useCallback(() => {
    const screenSharing = OT.initPublisher(
      screenSharingElement,
      {
        ...defaultPublisherOption,
        videoSource: 'screen',
      },
      handleError
    );

    // NOTICE: 一定要先 publish 後才能拿到 publisher.streamId
    session.publish(screenSharing, handleError);

    setPublishersInSession(prePublishers => [
      ...prePublishers,
      {
        connectionId,
        stream: { ...screenSharing.stream },
        streamId: screenSharing.streamId,
      },
    ]);

    setScreenSharing(screenSharing);
  }, [connectionId, screenSharingElement, session]);

  const unpublishScreenSharing = useCallback(() => {
    // unpublish 不會觸發自己的事件，因此需手動移除
    setPublishersInSession(prevPublishers =>
      prevPublishers.filter(
        publisher => publisher.streamId !== screenSharing.streamId
      )
    );

    session.unpublish(screenSharing);
    setScreenSharing(null);
  }, [screenSharing, session]);

  const subscribeStream = useCallback(
    streamId => {
      const theSubscriber = publishersInSession.find(
        p => p.streamId === streamId
      );

      const subscriber = session.subscribe(
        theSubscriber.stream,
        subscriberElement,
        {
          insertMode: 'append',
          width: '100%',
          height: '100%',
        }
      );

      setSubscribers(prevSubscribers => [
        ...prevSubscribers,
        {
          streamId: subscriber.streamId,
          subscriber,
        },
      ]);
    },
    [publishersInSession, session, subscriberElement]
  );

  const unsubscribeStream = useCallback(
    streamId => {
      const theSubscriber = subscribers.find(
        subscriber => subscriber.streamId === streamId
      );
      session.unsubscribe(theSubscriber.subscriber);
      setSubscribers(
        subscribers.filter(subscriber => subscriber.streamId !== streamId)
      );
    },
    [session, subscribers]
  );

  useEffect(() => {
    const { apiKey, sessionId, token } = credentials;

    if (!(apiKey && sessionId && token)) return;

    setSession(OT.initSession(apiKey, sessionId));
  }, [credentials]);

  // Register all related events
  useEffect(() => {
    if (!session) return;
    session.on('connectionCreated', handleConnectionCreated); // 自己和他人的都同時會觸發，可以取得 connectionId
    session.on('connectionDestroyed', handleConnectionDestroyed); // 只有他人的會觸發，可以取得 connectionId
    session.on('sessionDisconnected', handleSessionDisconnected); // 只有自己的會觸發
    session.on('streamCreated', handleStreamCreated); // 只有他人的會觸發，可以取得 stream 和 connectionId
    session.on('streamDestroyed', handleStreamDestroyed); // 只有他人的會觸發，可以取得 stream 和 connectionId
    // clean up function
    return () => {
      if (!session) return;
      console.log('--- clean up events ---');
      session.off('connectionCreated', handleConnectionCreated);
      session.off('connectionDestroyed', handleConnectionDestroyed);
      session.off('sessionDisconnected', handleSessionDisconnected);
      session.off('streamCreated', handleStreamCreated);
      session.off('streamDestroyed', handleStreamDestroyed);
    };
  }, [
    handleConnectionCreated,
    handleConnectionDestroyed,
    handleSessionDisconnected,
    handleStreamCreated,
    handleStreamDestroyed,
    session,
  ]);

  return [
    {
      credentials,
      session,
      subscribers,
      publisher,
      screenSharing,
      connectionId,
      clientsInSession,
      publishersInSession,
    },
    {
      connectSession,
      disconnectSession,
      publishToSession,
      unpublishToSession,
      publishScreenSharing,
      unpublishScreenSharing,
      subscribeStream,
      unsubscribeStream,
    },
    setCredentials,
  ];
};

export default useOpenTok;
