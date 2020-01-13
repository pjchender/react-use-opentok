/** @jsx jsx */
import React from 'react';
import { jsx, Styled } from 'theme-ui';
import { Global } from '@emotion/core';
import { Link } from 'gatsby';
import logo from '../images/logo.svg';


export default ({ children }) => (
  <Styled.root>
    <Global 
      styles={{
        body: {
          margin: 0
        }
      }}
    />
    <header
      sx={{
        display: 'flex',
        alignItems: 'center',
        variant: 'styles.header',
        p: 4
      }}>
      <img src={logo} 
        sx={{
          width: '36px',
          height: '36px',
        }}
      />
      <Link to='/'
        sx={{
          variant: 'styles.brand',
        }}>
        React Use OpenTok
      </Link>
      <div sx={{ mx: 'auto' }} />
      <Link to='/get-started'
        sx={{
          variant: 'styles.navlink',
        }}>
        Get Started
      </Link>
      <Link to='/docs'
        sx={{
          variant: 'styles.navlink',
        }}>
        Docs
      </Link>
    </header>
    <div
      sx={{
        padding: 4,
        fontFamily: 'body',
      }}
    >
      {children}
    </div>
  </Styled.root>
)