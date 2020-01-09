import { useEffect } from 'react';

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

export default (type, callback, session) => {
  const isEventTypeSupported = events.some(e => type.startsWith(e));
  if (!isEventTypeSupported) {
    console.warn('The event type may NOT supported');
  }
  if (typeof callback !== 'function') {
    throw new Error('Incorrect value or type of callback');
  }

  useEffect(() => {
    const { sessionId } = session || {};
    if (typeof sessionId !== 'string') {
      return;
    }

    session.on(type, callback);
    return () => {
      session.off(type, callback);
    };
  }, [session, type, callback]);
};
