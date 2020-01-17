/** @jsx jsx */
import { jsx, Styled } from 'theme-ui';
import { Global, css } from '@emotion/core';
import { Link } from 'gatsby';
import logo from '../images/logo.svg';

export default ({ children }) => (
  <Styled.root>
    <Global
      styles={css`
        @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap');
        body {
          margin: 0;
        }
      `}
    />
    <header
      sx={{
        display: 'flex',
        alignItems: 'center',
        variant: 'styles.header',
        px: 5,
        py: 3,
      }}
    >
      <img
        src={logo}
        alt="react-use-opentok logo"
        sx={{
          width: 30,
          height: 30,
        }}
      />
      <Link
        to="/"
        sx={{
          variant: 'styles.brand',
        }}
      >
        React Use OpenTok
      </Link>
      <div sx={{ mx: 'auto' }} />
      <Link
        to="/get-started"
        sx={{
          variant: 'styles.navlink',
        }}
      >
        Get Started
      </Link>
      <Link
        to="/docs"
        sx={{
          variant: 'styles.navlink',
        }}
      >
        Docs
      </Link>
    </header>
    <div
      sx={{
        maxWidth: 'container',
        mx: 'auto',
        fontFamily: 'body',
        mt: 4,
      }}
    >
      {children}
    </div>
  </Styled.root>
);
