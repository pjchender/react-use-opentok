import {
  MOCK_PUBLISHER,
  MOCK_SUBSCRIBER,
  MOCK_CONNECTION,
  MOCK_SESSION,
} from './../mockData';
import sessionEvent from './../mockEventEmitter';

const OT = {
  initSession(apiKey, sessionId) {
    let session = {
      ...MOCK_SESSION,
      connection: null,
      dispatch: jest.fn((type, event) => {
        sessionEvent.emit(type, event);
      }),
      on: jest.fn((type, callback) => {
        sessionEvent.on(type, callback);
      }),
      off: jest.fn((type, callback) => {
        sessionEvent.off(type, callback);
      }),
      connect: jest.fn((token, completeHandler) => {
        session.connection = MOCK_CONNECTION;
        completeHandler(null);
      }),
      disconnect: jest.fn(),
      publish: jest.fn((publisher, completeHandler) => completeHandler(null)),
      unpublish: jest.fn(),
      subscribe: jest.fn(() => MOCK_SUBSCRIBER),
      unsubscribe: jest.fn(),
      signal: jest.fn((signal, completeHandler) => {
        sessionEvent.emit('signal', signal);
        completeHandler(null);
      }),
    };
    return session;
  },
  initPublisher(element, options, handleError) {
    return MOCK_PUBLISHER;
  },
};

module.exports = OT;
