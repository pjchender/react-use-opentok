# react-use-opentok

[![Build status](https://badgen.net/travis/pjchender/react-use-opentok)](https://travis-ci.com/pjchender/react-use-opentok)
[![version](https://img.shields.io/npm/v/react-use-opentok.svg?color=brightgreen)](https://www.npmjs.com/package/react-use-opentok)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

React Hook for conveniently use @opentok/client SDK.

## Pre-requirement

* Register [Opentok](https://id.tokbox.com/login) to get authentication.

## Demo

See our demo site: [react-use-opentok](https://pjchender.github.io/react-use-opentok/)

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

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://andyyou.github.io/"><img src="https://avatars0.githubusercontent.com/u/665690?v=4" width="100px;" alt=""/><br /><sub><b>andyyou</b></sub></a><br /><a href="https://github.com/pjchender/react-use-opentok/commits?author=andyyou" title="Code">💻</a> <a href="#design-andyyou" title="Design">🎨</a> <a href="#example-andyyou" title="Examples">💡</a> <a href="#maintenance-andyyou" title="Maintenance">🚧</a> <a href="#ideas-andyyou" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/pjchender/react-use-opentok/pulls?q=is%3Apr+reviewed-by%3Aandyyou" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://pjchender.blogspot.com"><img src="https://avatars1.githubusercontent.com/u/13399740?v=4" width="100px;" alt=""/><br /><sub><b>PJCHENder</b></sub></a><br /><a href="https://github.com/pjchender/react-use-opentok/commits?author=pjchender" title="Code">💻</a> <a href="https://github.com/pjchender/react-use-opentok/commits?author=pjchender" title="Documentation">📖</a> <a href="https://github.com/pjchender/react-use-opentok/commits?author=pjchender" title="Tests">⚠️</a> <a href="#example-pjchender" title="Examples">💡</a> <a href="#maintenance-pjchender" title="Maintenance">🚧</a> <a href="https://github.com/pjchender/react-use-opentok/pulls?q=is%3Apr+reviewed-by%3Apjchender" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://allcontributors.org/) specification. Contributions of any kind welcome!

## LICENSE

[MIT](https://github.com/pjchender/react-use-opentok/blob/master/LICENSE)
