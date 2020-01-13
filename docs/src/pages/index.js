import React from 'react';
import Layout from '../components/layout';
import { Flex, Box } from '@theme-ui/components';
import Demo from '../components/demo';

export default () => (
  <Layout>
    <Flex>
      <Box 
        p={2}
        sx={{
          flex: 2,
        }}
      >
        <Demo />
      </Box>
      <Box p={2}
        sx={{
          flex: 1
        }}
      >
        react-use-opentok is a react hook library for Tokbox service.
      </Box>
    </Flex>
  </Layout>
)
