const MOCK_CREDENTIALS = {
  apiKey: '46461642',
  sessionId:
    '1_MX40NjQ2MTY0Mn5-MTU3NzY3ODg3ODA5M35nSkVlWE9rUEdxejBzallsdWVpU2tuK01-fg',
  token:
    'T1==cGFydG5lcl9pZD00NjQ2MTY0MiZzaWc9NmMwNjdlYjJiNTgxZjc4NDVkODY0ZDIxYmRjYzIyMTRjNmYyMmMyNzpzZXNzaW9uX2lkPTFfTVg0ME5qUTJNVFkwTW41LU1UVTNOelkzT0RnM09EQTVNMzVuU2tWbFdFOXJVRWR4ZWpCemFsbHNkV1ZwVTJ0dUswMS1mZyZjcmVhdGVfdGltZT0xNTc5NTk2ODg3Jm5vbmNlPTAuODYwMTU2NjA0NjcxNDI1MSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTgyMTg4ODg2JmNvbm5lY3Rpb25fZGF0YT0nJTdCJTIydGVzdGluZ0NvZGUlMjIlM0ElMjIwMDAwMDAlMjIlMkMlMjJ0b2tlbkRhdGElMjIlM0ElN0IlMjJyb2xlJTIyJTNBJTIycHVibGlzaGVyJTIyJTJDJTIybmFtZSUyMiUzQSUyMkhhbWFtYSUyMiUyQyUyMmdlbmRlciUyMiUzQTElMkMlMjJhZ2UlMjIlM0EzMCUyQyUyMmVkdWNhdGlvbkxldmVsJTIyJTNBMyUyQyUyMmNvdW50cnlJZCUyMiUzQTIxNCUyQyUyMmNpdHlJZCUyMiUzQTE4NjMxJTJDJTIyZGV2aWNlTW9kZWwlMjIlM0ElMjJpUGhvbmUxMi4zJTIyJTJDJTIyZGV2aWNlU3lzdGVtVmVyc2lvbiUyMiUzQSUyMmlvcyUyMDEzLjMlMjIlN0QlN0QnJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9',
};

const MOCK_STREAM = {
  id: '6713a6e6-7df0-4acc-a7e2-b60e1a83d070',
  streamId: '6713a6e6-7df0-4acc-a7e2-b60e1a83d070',
  name: '',
  creationTime: 1580375164948,
};

const MOCK_INIT_PUBLISHER = {
  name: 'camera',
  element: 'camera',
  options: {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    videoSource: 'screen',
  },
};

const MOCK_PUBLISHER = {
  id: 'OT_5ca7c0cf-b9a0-4417-89ca-6286521c7f46',
  isWebRTC: true,
  accessAllowed: true,
  element: {},
  session: {},
  streamId: MOCK_STREAM.streamId,
  stream: MOCK_STREAM,
};

const MOCK_SUBSCRIBER = {
  id: 'OT_046054d4-a053-4b2d-8662-0b83f48b1392',
  widgetId: '33c88bb0-f0e1-4ebc-94ec-5c00d8ea6a61',
  isWebRTC: true,
  session: {}, // Session Object
  streamId: MOCK_STREAM.streamId,
  stream: MOCK_STREAM, // Stream Object
  element: {},
};

const MOCK_CONNECTION = {
  id: '6bd8a316-00bf-461f-a0cd-053cab7b20b4',
  connectionId: '6bd8a316-00bf-461f-a0cd-053cab7b20b4',
  creationTime: 1580443544160,
  data: '',
  capabilities: {
    supportsWebRTC: true,
  },
  permissions: {
    publish: 1,
    subscribe: 1,
    forceUnpublish: 0,
    forceDisconnect: 0,
    supportsWebRTC: 1,
  },
  quality: null,
};

const MOCK_SESSION = {
  id:
    '1_MX40NjQ2MTY0Mn5-MTU3NzY3ODg3ODA5M35nSkVlWE9rUEdxejBzallsdWVpU2tuK01-fg',
  sessionId:
    '1_MX40NjQ2MTY0Mn5-MTU3NzY3ODg3ODA5M35nSkVlWE9rUEdxejBzallsdWVpU2tuK01-fg',
  currentState: 'connected',
  connection: MOCK_CONNECTION, // Connection 物件
  connections: {},
  streams: {},
  archives: {},
  capabilities: {
    publish: 1,
    subscribe: 1,
    forceUnpublish: 0,
    forceDisconnect: 0,
    supportsWebRTC: 1,
  },
  token: MOCK_CREDENTIALS.token,
  previousState: 'connecting',
  apiKey: MOCK_CREDENTIALS.apiKey,
  staticConfig: {},
  sessionInfo: {},
};

const MOCK_SIGNAL = {
  to: 'to-specific-user',
  type: 'foo',
  data: JSON.stringify({
    foo: 'bar',
  }),
  completionHandler: jest.fn(),
};

export {
  MOCK_SESSION,
  MOCK_CREDENTIALS,
  MOCK_STREAM,
  MOCK_PUBLISHER,
  MOCK_INIT_PUBLISHER,
  MOCK_SUBSCRIBER,
  MOCK_CONNECTION,
  MOCK_SIGNAL,
};
