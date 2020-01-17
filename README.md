# react-use-opentok

[NPM Badge]

React Hook for conveniently use @opentok/client SDK.

## Pre-requirement

* Register [Opentok](https://id.tokbox.com/login) to get authentication.

## Demo

See our demo site: [react-use-opentok](https://pjchender.github.com/react-use-opentok)

![react-use-opentok](https://i.imgur.com/mpmlkrI.gif)

## Installation

Install it with npm:

```
npm i react-use-opentok --save
```

Or with yarn:

```
yarn add react-use-opentok
```

> NOTE: remember to install the peer dependency of [@opentok/client](https://www.npmjs.com/package/@opentok/client)

## Getting Start

```js
import React, { useEffect } from 'react';
import useOpenTok from 'react-use-opentok';

const Component = () => {
  const [opentokProps, opentokMethods, setCredentials] = useOpenTok();

  const {
    // credentials
    apiKey,
    sessionId,
    token,

    // connection info
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
    connectSession,
    disconnectSession,
    publish,
    unpublish,
    subscribe,
    unsubscribe,
    sendSignal,
  } = opentokMethods;

  // Mockup fetching credentials from server
  useEffect(() => {
    fetch('<get credentials from server>').then(
      ({ apiKey, sessionId, token }) => {
        setCredentials({
          apiKey,
          sessionId,
          token,
        });
      }
    );
  }, [setCredentials]);

  return <div>...</div>;
};

export default Component;
```

## Guide

### useOpenTok Hook

You can get all utilities of [@opentok/client](https://www.npmjs.com/package/@opentok/client) from `useOpenTok` hook.

```js
const [opentokProps, opentokMethods, setCredentials] = useOpenTok();
```

### connect to

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
$ npm start         # start gatsby develope server
```

## Contributors

Thanks goes to these wonderful people (emoji key):

[https://allcontributors.org/]

This project follows the all-contributors specification. Contributions of any kind welcome!
