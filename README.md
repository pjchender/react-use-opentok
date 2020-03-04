# react-use-opentok

[![Build status](https://badgen.net/travis/pjchender/react-use-opentok)](https://travis-ci.com/pjchender/react-use-opentok)
[![version](https://img.shields.io/npm/v/react-use-opentok.svg)](https://www.npmjs.com/package/react-use-opentok)
[![Coverage Status](https://coveralls.io/repos/github/pjchender/react-use-opentok/badge.svg?branch=master)](https://coveralls.io/github/pjchender/react-use-opentok?branch=master)
[![license](https://img.shields.io/github/license/pjchender/react-use-opentok.svg)](https://github.com/pjchender/react-use-opentok/blob/master/LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg)](#contributors)

React Hook for conveniently use @opentok/client SDK.

## Pre-requirement

* Register [Opentok](https://id.tokbox.com/login) to get authentication.

## Demo

See our demo site: [react-use-opentok](https://pjchender.github.io/react-use-opentok/)

![react-use-opentok](https://i.imgur.com/mpmlkrI.gif)

## Installation

Install it with npm:

```
npm i @opentok/client@2.x react-use-opentok
```

Or with yarn:

```
yarn add @opentok/client@2.x react-use-opentok
```

> NOTE: remember to install the peer dependency of [@opentok/client](https://www.npmjs.com/package/@opentok/client)

## Getting Started

1. Get utilities from `useOpenTok` hook
2. Fetch `apiKey`, `sessionId`, and `token` from server
3. Connect to session with `token`

```js
import React, { useEffect } from 'react';
import useOpenTok from 'react-use-opentok';

const Component = () => {
  // STEP 1: get utilities from useOpenTok;
  const [opentokProps, opentokMethods] = useOpenTok();

  const {
    // connection info
    isSessionInitialized,
    connectionId,
    isSessionConnected,

    // connected data
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

  // STEP 2: Mockup fetching apiKey, sessionId, and token from server
  useEffect(() => {
    fetch('<get credentials from server>').then(
      ({ apiKey, sessionId, token }) => {
        initSessionAndConnect({
          apiKey,
          sessionId,
          token,
        });
      }
    );
  }, [initSessionAndConnect]);

  return <div>...</div>;
};

export default Component;
```

## Guide

### Get all utilities from useOpenTok Hook

You can get all utilities from `useOpenTok` hook.

```js
const [opentokProps, opentokMethods] = useOpenTok();

const {
  // connection info
  isSessionInitialized,
  connectionId,
  isSessionConnected,

  // connected data
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
```

### Connect and disconnect to session

Before starting use openTok session object, remember to initialize session with `apiKey` and `sessionId` by `initSessionAndConnect` method:

```js
const [opentokProps, opentokMethods] = useOpenTok();
const { initSessionAndConnect } = opentokMethods;

// apiKey, sessionId, and token could get from your server or tokbox dashboard
initSessionAndConnect({
  apiKey,
  sessionId,
  token,
});
```
This methods will first initialize the session object, and continue connected to the session.

After session initialized, the value of `isSessionInitialized` will be `true.

After connect to session, you can get the `session`, `connectionId` , `isSessionConnected`, and `connections` properties from `opentokProps`:

- `session`: a session object from [`OT.initSession()`](https://tokbox.com/developer/sdks/js/reference/OT.html#initSession)
- `connectionId`: your own connectionId
- `isSessionConnected`: whether you are connected to the session
- `connections`: all connections in the session

```js
const [opentokProps, opentokMethods] = useOpenTok();
const { session, connectionId, isSessionConnected, connections } = opentokProps;
```

By `disconnectSession`, you can disconnect from the session:

```js
const [opentokProps, opentokMethods] = useOpenTok();
const { disconnectSession } = opentokMethods;

disconnectSession();
```

> If you want to control the process of session initialization and connect to session on your own, check the method `initSession({ apiKey, sessionId, sessionOptions })` and `connectSession({token, sessionToConnect })`.

### Publish and unpublished stream to the session

You can publish stream from camera or screen to session through the `publish` method.

- `name`: should be unique every time you invoke publish method which is for `unpublish` stream later.
- `element`: should be a DOM element or the `id` attribute of the existing DOM element.
- `options`: (optional) other optional properties which will pass into [OT.initPublisher](https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher).

```js
const [opentokProps, opentokMethods] = useOpenTok();
const { publish } = opentokMethods;

// publish stream from the camera
publish({
  name: 'camera',
  element: 'camera',
});

// publish stream from screen sharing
publish({
  name: 'screen',
  element: 'screen',
  options: {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    videoSource: 'screen',
  },
});

// publish support Promise way to catch errors
publish({
  name: 'camera',
  element: 'camera',
}).catch((ex) => {
  console.log(ex);
});
```

According to the `name` you publish, you could use the same name to unpublish it:

```js
const [opentokProps, opentokMethods] = useOpenTok();
const { unpublish } = opentokMethods;

// unpublish stream from the name 'camera'
unpublish({ name: 'camera' }
```

### Subscribe and Unsubscribe

You can get all streams in the session through `streams` property in `opentokProps`. After finding the stream for subscribing, use the `subscribe` method to subscribe to the stream:

- `stream`: the Stream Object wanted to subscribe
- `element`: should be a DOM element or the `id` attribute of the existing DOM element.

```js
const [opentokProps, opentokMethods] = useOpenTok();
const { streams } = opentokProps;
const { subscribe } = opentokMethods;

const streamToSubscribe = streams[0];
subscribe({ stream: streamToSubscribe, element: 'subscriber' });
```

For each stream be subscribed, a [subscriber object](https://tokbox.com/developer/sdks/js/reference/Session.html#subscribe) will be created and save as `subscribers` in `opentokProps`:

```js
const [opentokProps, opentokMethods] = useOpenTok();
const { streams, subscribers } = opentokProps;
```

You can stop subscribing the stream with `unsubscribe` method:

```js
const [opentokProps, opentokMethods] = useOpenTok();
const { unsubscribe } = opentokMethods;

const streamToUnsubscribe = streams[0];
unsubscribe({ stream: streamToUnsubscribe });
```

### Send signal

You can send signal in session with `sendSignal` method:

```js
const [opentokProps, opentokMethods] = useOpenTok();
const { sendSignal } = opentokMethods;

sendSignal({
  type: 'foo',
  data: 'bar',
});
```

### Register session events

You could register all valid [session events](https://tokbox.com/developer/sdks/js/reference/Session.html#events) on `session` object. Take registering signal event, as an example,  use the `session` object in `opentokProps`, register the session event with `on`, and unregister the event with `off`:

```js
const [opentokProps, opentokMethods] = useOpenTok();
const { session } = opentokProps;

const handleSignal = useCallback(e => {
  console.log('handleSignal', e);
}, []);

useEffect(() => {
  if (!isSessionConnected) {
    return;
  }

  session.on('signal', handleSignal);
  return () => {
    session.off('signal', handleSignal);
  };
}, [handleSignal, isSessionConnected, session]);
```

> NOTICE: for `sessionDisconnected` event, you can you `session.once('sessionDisconnected', <eventHandler>)`

## Development

### for react-use-opentok package

```sh
$ npm install
$ npm start         # rollup will watch the files change
$ npm build         # rollup will build the package
$ npm test
```

### for example site

```sh
$ cd site
$ npm install
$ npm start         # start gatsby develop server
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://andyyou.github.io/"><img src="https://avatars0.githubusercontent.com/u/665690?v=4" width="100px;" alt=""/><br /><sub><b>andyyou</b></sub></a><br /><a href="https://github.com/pjchender/react-use-opentok/commits?author=andyyou" title="Code">💻</a> <a href="#design-andyyou" title="Design">🎨</a> <a href="#example-andyyou" title="Examples">💡</a> <a href="#maintenance-andyyou" title="Maintenance">🚧</a> <a href="#ideas-andyyou" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/pjchender/react-use-opentok/pulls?q=is%3Apr+reviewed-by%3Aandyyou" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://pjchender.blogspot.com"><img src="https://avatars1.githubusercontent.com/u/13399740?v=4" width="100px;" alt=""/><br /><sub><b>PJCHENder</b></sub></a><br /><a href="https://github.com/pjchender/react-use-opentok/commits?author=pjchender" title="Code">💻</a> <a href="https://github.com/pjchender/react-use-opentok/commits?author=pjchender" title="Documentation">📖</a> <a href="https://github.com/pjchender/react-use-opentok/commits?author=pjchender" title="Tests">⚠️</a> <a href="#example-pjchender" title="Examples">💡</a> <a href="#maintenance-pjchender" title="Maintenance">🚧</a> <a href="https://github.com/pjchender/react-use-opentok/pulls?q=is%3Apr+reviewed-by%3Apjchender" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/Mwjrink"><img src="https://avatars2.githubusercontent.com/u/29183162?v=4" width="100px;" alt=""/><br /><sub><b>Maximillian Rink</b></sub></a><br /><a href="https://github.com/pjchender/react-use-opentok/commits?author=Mwjrink" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://allcontributors.org/) specification. Contributions of any kind welcome!

## LICENSE

[MIT](https://github.com/pjchender/react-use-opentok/blob/master/LICENSE)
