/** @jsx jsx */
import React from 'react';
import { jsx } from 'theme-ui';
import { Global } from '@emotion/core';

export default ({ children }) => (
  <>
    <Global 
      styles={{
        body: {
          margin: 0
        }
      }}
    />
    <header
      sx={{
        padding: 4,
        color: 'background',
        backgroundColor: 'primary',
      }}
    >
      Header
    </header>
    {children}
  </>
)