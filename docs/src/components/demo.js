/** @jsx jsx */
import React, { useEffect, useCallback } from 'react';
import { jsx } from 'theme-ui';
import { useFormik } from 'formik';
import useOpenTok from 'react-use-opentok';
import Button from '../components/button';
import {
  Box,
  Label,
  Input,
  Select,
} from '@theme-ui/components'

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

  const formik = useFormik({
    initialValues: {
      apiKey: API_KEY,
      sessionId: SESSION_ID,
      token: TOKEN,
    },
    onSubmit: values => {
      console.log(values);
      setCredentials({...values});
    },
  });
  useEffect(() => {
    console.log(session);
    if (session) {
      connectSession();
    }
  }, [session]);

  const streamGroups = streams && streams.reduce((groups, stream) => {
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
          mb: 3,
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
          <div>
            <Box
              as='form'
              onSubmit={formik.handleSubmit}
            >
              <Label htmlFor='apiKey' mt={3}>API Key</Label>
              <Input
                name='apiKey'
                mb={3}
                onChange={formik.handleChange}
                value={formik.values.apiKey}
              />
              <Label htmlFor='sessionId'>Session ID</Label>
              <Input
                name='sessionId'
                mb={3}
                onChange={formik.handleChange}
                value={formik.values.sessionId}
              />
              <Label htmlFor='apiKey'>Token</Label>
              <Input
                name='token'
                mb={3}
                onChange={formik.handleChange}
                value={formik.values.token}
              />
              <Button
                type="submit"
                disabled={isSessionConnected}
              >
                Connect to Session
              </Button>
            </Box>
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
        </div>
        <div
          sx={{
            flex: 1,
            px: 3
          }}
        >
          <div sx={{ pb: 3 }}>
            Connections
          </div>
          <ul sx={{ pl: '1rem' }}>
            {connections.map(c => (
              <li key={c.connectionId}>
                {c.connectionId} {c.connectionId === connectionId && '(You)'}
              </li>
            ))}
          </ul>
          <div sx={{ py: 3 }}>
            Streams
          </div>
          <ul sx={{ pl: '1rem' }}>
            {Object.entries(streamGroups).map(([groudId, streams]) => (
              <li key={groudId}>
                Connection ID: {groudId.split('-')[0]}
                <ul sx={{ pl: '1rem' }}>
                  {streams.map(stream => {
                    const { streamId, connection } = stream;
                    return (
                      <li key={streamId}>
                        {connection.connectionId === connectionId ? (
                          `Stream ID: ${streamId.split('-')[0]} (You)`
                        ) : (
                          <>
                            <Button
                              sx={{ p: 1, fontSize: 0, border: '1px solid', mx: 1 }}
                              onClick={() =>
                                subscribe({ stream, element: 'subscriber' })
                              }
                            >
                              Watch
                            </Button>
                            {' '}
                            {subscribers.some(
                              subscriber => subscriber.streamId === streamId
                            ) && (
                              <Button
                                sx={{ p: 1, fontSize: 0, border: '1px solid', mx: 1 }}
                                onClick={() => unsubscribe({ stream })}
                              >
                                STOP
                              </Button>
                            )}
                            {`Stream ID: ${streamId.split('-')[0]}`}
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