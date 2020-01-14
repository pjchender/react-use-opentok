/** @jsx jsx */
import React, { useEffect, useCallback } from 'react';
import { jsx } from 'theme-ui';
import useOpenTok from 'react-use-opentok';
import Button from '../components/button';

import {
  API_KEY,
  SESSION_ID,
  TOKEN,
} from '../constants';

// The options is used for 
//   `Session.subscribe` and `Session.initPublisher`
const defaultOpenTokOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
};

export default () => {
  const [
    opentokProps,
    opentokMethods,
    setCredentials,
  ] = useOpenTok();

  const {
    apiKey,
    sessionId,
    token,

    connectionId,
    isSessionConnected,

    session,
    connections,
    streams,

    subscribers,
    publisher,
  } = opentokProps;

  const {
    connectSession,
    disconnectSession,
    publish,
    unpublish,
    subscribe,
    unsubscribe,
  } = opentokMethods;

  // Listener of `signal`
  // References https://tokbox.com/developer/sdks/js/reference/SignalEvent.html
  const handleSignal = useCallback((e) => {
    console.log('signal event', e);
  }, []);
  useEffect(() => {
    if (!isSessionConnected) {
      return;
    }
    session.on('signal', handleSignal);
    return () => {
      session.off('signal', handleSignal);
    }
  }, [handleSignal, isSessionConnected, session]);

  // Dummy request to get credentials
  useEffect(() => {
    setTimeout(() => {
      setCredentials({
        apiKey: API_KEY,
        sessionId: SESSION_ID,
        token: TOKEN,
      });
    }, 1000);
    return () => {
      console.log('disconnect');
      if (isSessionConnected) {
        disconnectSession();
      }
    };
  }, [disconnectSession, isSessionConnected, setCredentials]);
  if (!(apiKey && sessionId && token)) return null;

  const streamGroups = streams.reduce((groups, stream) => {
    const {
      connection,
    } = stream;
    groups[connection.connectionId] = groups[connection.connectionId] || [];
    groups[connection.connectionId].push(stream);
    return groups
  }, {});

  return (
    <>
      <div
        sx={{
          display: 'flex',
        }}
      >
        <div
          sx={{
            flex: 2,
          }}
        >
          <div
            sx={{
              position: 'relative',
              minHeight: 480,
              backgroundColor: 'black',
              width: `100%`,
            }}
          >
            <div 
              id="subscriber"
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 2,
              }}
            ></div>
            <div 
              id="camera"
              sx={{
                position: 'absolute',
                width: 240,
                height: 180,
                right: 10,
                bottom: 10,
                zIndex: 3,
              }}
            ></div>
            <div 
              id="screen"
              sx={{
                position: 'absolute',
                width: 240,
                height: 180,
                right: 10,
                top: 10,
                zIndex: 3,
              }}
            ></div>
          </div>
        </div>
        <div
          sx={{
            flex: 1,
            px: 2
          }}
        >
          <div sx={{ pb: 3, fontSize: 3 }}>
            OpenTok Actions
          </div>
          <div>
            <Button
              disabled={isSessionConnected}
              onClick={connectSession}
            >
              Connect to Session
            </Button>
            {(session && session.currentState) === 'connected' && (
              <>
                <Button variant='secondary' onClick={disconnectSession}>Disconnect to Session</Button>
                <Button
                  onClick={() => {
                    publish({
                      name: 'camera',
                      element: 'camera',
                    });
                  }}
                >
                  Publish your stream
                </Button>
                {publisher.camera && (
                  <Button 
                    variant='secondary'
                    onClick={() => unpublish({ name: 'camera' })}
                  >
                    Stop publish
                  </Button>
                )}
                <Button
                  onClick={() =>
                    publish({
                      name: 'screen',
                      element: 'screen',
                      options: { ...defaultOpenTokOptions, videoSource: 'screen' },
                    })
                  }
                >
                  Start Share Screen (Desktop)
                </Button>
                {publisher.screen && (
                  <Button 
                    variant='secondary'
                    onClick={() => unpublish({ name: 'screen' })}
                  >
                    Stop Share Screen (Desktop)
                  </Button>
                )}
              </>
            )}
          </div>

          <div sx={{ py: 3, fontSize: 3 }}>
            Connections
          </div>
          <ul>
            {connections.map(c => (
              <li key={c.connectionId}>
                {c.connectionId} {c.connectionId === connectionId && '(You)'}
              </li>
            ))}
          </ul>
          <div sx={{ py: 3, fontSize: 3 }}>
            Streams
          </div>
          <ul>
            {Object.entries(streamGroups).map(([connectionId, streams]) => (
              <li key={connectionId}>
                {connectionId}
                <ul>
                  {streams.map(stream => {
                    const { streamId, connection } = stream;
                    return (
                      <li key={streamId}>
                        {connection.connectionId === connectionId ? (
                          `${streamId} (You)`
                        ) : (
                          <>
                            {streamId}
                            <Button
                              onClick={() =>
                                subscribe({ stream, element: 'subscriber' })
                              }
                            >
                              Subscribe
                            </Button>
                            {' '}
                            {subscribers.some(
                              subscriber => subscriber.streamId === streamId
                            ) && (
                              <Button
                                onClick={() => unsubscribe({ stream })}
                              >
                                STOP Subscribe
                              </Button>
                            )}
                          </>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      
      
    </>
  );
};