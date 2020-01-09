import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import useOpenTok from 'react-use-opentok';
export const API_KEY = '46461642';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 100px);
  min-height: 600px;
  margin-left: auto;
  margin-right: auto;
  background-color: gray;
`;

const Subscriber = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
`;

const Publisher = styled.div`
  position: absolute;
  width: 360px;
  height: 240px;
  bottom: 10px;
  right: 10px;
  z-index: 100;
  border: 3px solid white;
  border-radius: 3px;
`;

const ScreenSharing = styled.div`
  position: absolute;
  width: 360px;
  height: 240px;
  bottom: 10px;
  left: 10px;
  z-index: 100;
  border: 3px solid white;
  border-radius: 3px;
`;

const Button = styled.button`
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  margin-right: 5px;
  margin-bottom: 5px;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &.btn-primary {
    color: #007bff;
    border-color: #007bff;
    &:hover {
      color: #fff;
      background-color: #007bff;
      border-color: #007bff;
    }
  }

  &.btn-danger {
    color: #dc3545;
    border-color: #dc3545;

    &:hover {
      color: #fff;
      background-color: #dc3545;
      border-color: #dc3545;
    }
  }
`;

const LinkButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  user-select: none;
  margin: 0;
  letter-spacing: 0.3px;
  line-height: 1;
  cursor: pointer;
  overflow: visible;
  text-transform: none;
  -webkit-appearance: button;
  border: 1px solid transparent;
  background-color: transparent;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus,
  &.focus {
    outline: 0;
    box-shadow: none;
  }

  &::-moz-focus-inner {
    padding: 0;
    border-style: none;
  }
  color: #007bff;
`;

const ClientsList = styled.div`
  li {
    margin: 0;
    padding: 0;
  }
`;

const SESSION_ID =
  '1_MX40NjQ2MTY0Mn5-MTU3NzY3ODg3ODA5M35nSkVlWE9rUEdxejBzallsdWVpU2tuK01-fg';
const TOKEN_PUBLISHER =
  'T1==cGFydG5lcl9pZD00NjQ2MTY0MiZzaWc9MTg3MTAyMTEyM2YwZjc3MzUwN2EwNTk3NDEyN2VkMGI4NTkwNWZlMDpzZXNzaW9uX2lkPTFfTVg0ME5qUTJNVFkwTW41LU1UVTNOelkzT0RnM09EQTVNMzVuU2tWbFdFOXJVRWR4ZWpCemFsbHNkV1ZwVTJ0dUswMS1mZyZjcmVhdGVfdGltZT0xNTc3OTUzNDgzJm5vbmNlPTAuOTI5Mjc5Mzg2MzU3ODcwNiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTgwNTQ1NDgzJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';

// default options for subscribe and initPublisher
const defaultOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
};

const Tester = () => {
  const [properties, methods, setCredentials] = useOpenTok();

  const {
    apiKey,
    sessionId,
    token,

    connectionId,
    isSessionConnected,

    session,
    streams,
    connections,

    subscribers,
    publisher,
  } = properties;

  const {
    connectSession,
    disconnectSession,
    publish,
    unpublish,
    subscribe,
    unsubscribe,
  } = methods;

  // 如果需要監聽 signal 事件
  const handleSignal = useCallback(e => {
    console.log('e', e);
  }, []);

  useEffect(() => {
    if (!isSessionConnected) return;
    session.on('signal', handleSignal);
    return () => {
      session.off('signal', handleSignal);
    };
  }, [handleSignal, isSessionConnected, session]);

  useEffect(() => {
    setTimeout(() => {
      setCredentials({
        apiKey: API_KEY,
        sessionId: SESSION_ID,
        token: TOKEN_PUBLISHER,
      });
    }, 1000);

    return () => {
      console.log('cleanup tester');
      if (isSessionConnected) {
        disconnectSession();
      }
    };
  }, [disconnectSession, isSessionConnected, setCredentials]);

  if (!(apiKey && sessionId && token)) return null;

  return (
    <>
      {console.log('render')}
      <div>
        <Button type="button" className="btn-primary" onClick={connectSession}>
          Connect Session
        </Button>

        {(session && session.currentState) === 'connected' && (
          <>
            <Button
              type="button"
              className="btn-danger"
              onClick={disconnectSession}
            >
              Disconnect Session
            </Button>

            <Button
              type="button"
              className="btn-primary"
              onClick={() =>
                publish({
                  name: 'camera',
                  element: 'camera',
                })
              }
            >
              Publish
            </Button>

            {publisher.camera && (
              <Button
                type="button"
                className="btn-danger"
                onClick={() => unpublish({ name: 'camera' })}
              >
                Stop Publish
              </Button>
            )}

            <Button
              type="button"
              className="btn-primary"
              onClick={() =>
                publish({
                  name: 'screen',
                  element: 'screen',
                  options: { ...defaultOptions, videoSource: 'screen' },
                })
              }
            >
              Desktop Sharing
            </Button>

            {publisher.screen && (
              <Button
                type="button"
                className="btn-danger"
                onClick={() => unpublish({ name: 'screen' })}
              >
                Stop Desktop Sharing
              </Button>
            )}
          </>
        )}

        <div>my connection id: {connectionId}</div>
        <ClientsList>
          在 Session 中的使用者:
          <ul>
            {connections.map(c => (
              <li key={c.connectionId}>
                {c.connectionId} {c.connectionId === connectionId && '(Me)'}
              </li>
            ))}
          </ul>
        </ClientsList>

        <ClientsList>
          有發佈串流的使用者：
          <ul>
            {streams.map(stream => {
              const { streamId, connection } = stream;
              return (
                <li key={streamId}>
                  {connection.connectionId === connectionId ? (
                    `${streamId} (${connection.connectionId}) (Me)`
                  ) : (
                    <>
                      <LinkButton
                        type="button"
                        onClick={() =>
                          subscribe({ stream, element: 'subscriber' })
                        }
                      >
                        {streamId} ({connection.connectionId})
                      </LinkButton>{' '}
                      {subscribers.some(
                        subscriber => subscriber.streamId === streamId
                      ) && (
                        <button
                          type="button"
                          onClick={() => unsubscribe({ stream })}
                        >
                          STOP Subscribe
                        </button>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </ClientsList>
      </div>
      <Container>
        <Subscriber id="subscriber" />
        <Publisher id="camera" />
        <ScreenSharing id="screen" />
      </Container>
    </>
  );
};

Tester.displayName = 'Tester';

export default Tester;
