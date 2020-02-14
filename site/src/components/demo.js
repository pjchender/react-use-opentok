/** @jsx jsx */
import React, { useEffect, useCallback } from 'react';
import { jsx } from 'theme-ui';
import { useFormik } from 'formik';
import useOpenTok from 'react-use-opentok';
import useLocalStorage from 'react-use-localstorage';
import {
  Box,
  Label,
  Input,
  Textarea,
  Button,
  Badge,
} from '@theme-ui/components';
import ConsoleFeed from './console-feed';

import { API_KEY, SESSION_ID, TOKEN } from '../constants';

// The options is used for
//   `Session.subscribe` and `Session.initPublisher`
const defaultOpenTokOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
};

export default () => {
  const [opentokProps, opentokMethods] = useOpenTok();
  const [credentials, setCredentials] = useLocalStorage(
    'credentials',
    JSON.stringify({
      apiKey: API_KEY,
      sessionId: SESSION_ID,
      token: TOKEN,
    })
  );

  const {
    connectionId,
    isSessionConnected,

    session,
    connections,
    streams,
    subscribers,
    publisher,
  } = opentokProps;

  const {
    initSessionAndConnect,
    disconnectSession,
    publish,
    unpublish,
    subscribe,
    unsubscribe,
    sendSignal,
  } = opentokMethods;

  const credentialsFormik = useFormik({
    initialValues: {
      ...JSON.parse(credentials),
    },
    onSubmit: async (values, { setSubmitting }) => {
      const { apiKey, sessionId, token } = values;
      setCredentials(
        JSON.stringify({
          ...values,
        })
      );

      await initSessionAndConnect({
        apiKey,
        sessionId,
        token,
      });

      setSubmitting(false);
    },
  });

  const signalFormik = useFormik({
    initialValues: {
      type: '',
      data: '',
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      if (values.data.length === 0) {
        console.warn('signal data is empty');
        return;
      }

      sendSignal({
        ...values,
      });

      setTimeout(() => {
        resetForm();
        setSubmitting(false);
      }, 400);
    },
  });

  // Listener of `signal`
  // References https://tokbox.com/developer/sdks/js/reference/SignalEvent.html
  const handleSignal = useCallback(e => {
    console.log('handleSignal', e);
  }, []);

  const handleSessionDisconnected = useCallback(e => {
    console.log('handle session disconnected', e);
  }, []);

  useEffect(() => {
    if (!isSessionConnected) {
      return;
    }
    session.on('signal', handleSignal);
    session.once('sessionDisconnected', handleSessionDisconnected);
    return () => {
      session.off('signal', handleSignal);
    };
  }, [handleSignal, handleSessionDisconnected, isSessionConnected, session]);

  const streamGroups =
    streams &&
    streams.reduce((groups, stream) => {
      const { connection } = stream;
      groups[connection.connectionId] = groups[connection.connectionId] || [];
      groups[connection.connectionId].push(stream);
      return groups;
    }, {});

  if (typeof window === 'undefined') return null;

  return (
    <>
      <div
        sx={{
          display: 'flex',
          mb: 3,
        }}
      >
        {/* Left Side */}
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
            {isSessionConnected ? (
              <>
                <div
                  sx={{
                    mt: 3,
                  }}
                >
                  <Button variant="primary" onClick={disconnectSession}>
                    Disconnect to Session
                  </Button>

                  {!publisher.camera ? (
                    <Button
                      variant="primary"
                      onClick={() => {
                        publish({
                          name: 'camera',
                          element: 'camera',
                        });
                      }}
                    >
                      Publish Camera Stream
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => unpublish({ name: 'camera' })}
                    >
                      Stop Publish
                    </Button>
                  )}

                  {!publisher.screen ? (
                    <Button
                      variant="primary"
                      onClick={() =>
                        publish({
                          name: 'screen',
                          element: 'screen',
                          options: {
                            ...defaultOpenTokOptions,
                            videoSource: 'screen',
                          },
                        })
                      }
                    >
                      Start Share Screen (Desktop)
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => unpublish({ name: 'screen' })}
                    >
                      Stop Share Screen (Desktop)
                    </Button>
                  )}
                </div>

                <Box as="form" onSubmit={signalFormik.handleSubmit}>
                  <Label htmlFor="type" my={3}>
                    Signal
                  </Label>
                  <Input
                    name="type"
                    placeholder="Type"
                    onChange={signalFormik.handleChange}
                    value={signalFormik.values.type}
                    mb={3}
                  />
                  <Textarea
                    name="data"
                    placeholder="Data"
                    onChange={signalFormik.handleChange}
                    value={signalFormik.values.data}
                    rows="6"
                    mb={3}
                  />
                  <Button
                    variant="secondary"
                    type="submit"
                    sx={{
                      display: 'block',
                      marginLeft: 'auto',
                    }}
                    disabled={
                      !signalFormik.values.data.length ||
                      signalFormik.isSubmitting
                    }
                  >
                    Send Signal
                  </Button>
                </Box>
              </>
            ) : (
              <Box as="form" onSubmit={credentialsFormik.handleSubmit}>
                <Label htmlFor="apiKey" mt={3} mb={1}>
                  API Key
                </Label>
                <Input
                  name="apiKey"
                  mb={3}
                  onChange={credentialsFormik.handleChange}
                  value={credentialsFormik.values.apiKey}
                />
                <Label htmlFor="sessionId" mb={1}>
                  Session ID
                </Label>
                <Input
                  name="sessionId"
                  mb={3}
                  onChange={credentialsFormik.handleChange}
                  value={credentialsFormik.values.sessionId}
                />
                <Label htmlFor="apiKey" mb={1}>
                  Token
                </Label>
                <Input
                  name="token"
                  mb={3}
                  onChange={credentialsFormik.handleChange}
                  value={credentialsFormik.values.token}
                />
                <Button
                  variant="secondary"
                  type="submit"
                  disabled={credentialsFormik.isSubmitting}
                  sx={{
                    display: 'block',
                    marginLeft: 'auto',
                  }}
                >
                  Connect to Session
                </Button>
              </Box>
            )}
            <ConsoleFeed />
          </div>
        </div>

        {/* Right Side */}
        <div
          sx={{
            flex: 1,
            px: 3,
          }}
        >
          <div sx={{ pt: 3 }}>Connections</div>
          <ul sx={{ pl: '1rem', mt: 2 }}>
            {connections.map(c => (
              <li key={c.connectionId}>
                {c.connectionId}{' '}
                {c.connectionId === connectionId && (
                  <Badge variant="outline" ml={1}>
                    You
                  </Badge>
                )}
              </li>
            ))}
          </ul>
          <div sx={{ pt: 3 }}>Streams</div>
          <ul sx={{ pl: '1rem', mt: 2 }}>
            {Object.entries(streamGroups).map(([groupId, streams]) => (
              <li key={groupId}>
                Connection ID: {groupId.split('-')[0]}{' '}
                {groupId === connectionId && (
                  <Badge variant="outline" ml={1}>
                    You
                  </Badge>
                )}
                <ul sx={{ pl: '1rem', py: 2 }}>
                  {streams.map(stream => {
                    const { streamId, connection } = stream;
                    return (
                      <li key={streamId}>
                        {connection.connectionId === connectionId ? (
                          `Stream ID: ${streamId.split('-')[0]} (${
                            stream.videoType
                          })`
                        ) : (
                          <>
                            {`Stream ID: ${streamId.split('-')[0]}`}{' '}
                            {subscribers.some(
                              subscriber => subscriber.streamId === streamId
                            ) ? (
                              <Button
                                variant="secondary"
                                sx={{
                                  p: 1,
                                  fontSize: 0,
                                  border: '1px solid',
                                  mx: 1,
                                }}
                                onClick={() => unsubscribe({ stream })}
                              >
                                STOP
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                sx={{
                                  p: 1,
                                  fontSize: 0,
                                  border: '1px solid',
                                  mx: 1,
                                }}
                                onClick={() =>
                                  subscribe({ stream, element: 'subscriber' })
                                }
                              >
                                Watch
                              </Button>
                            )}
                          </>
                        )}
                      </li>
                    );
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
