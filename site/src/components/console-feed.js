import React, { useState, useEffect, useRef } from 'react';
import { Hook, Console } from 'console-feed';
import { Box, Heading } from '@theme-ui/components';

const scrollToBottom = targetElement => {
  if (!targetElement) return;
  targetElement.scrollTo({
    top: targetElement.scrollHeight,
    behavior: 'smooth',
  });
};

const ConsoleFeed = () => {
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    Hook(
      window.console,
      log => {
        setLogs(prevLogs => [...prevLogs, log]);
        scrollToBottom(containerRef.current);
      },
      false
    );
  }, []);

  return (
    <>
      <Heading as="h3" mt="4">
        Browser Console
      </Heading>
      <Box
        ref={containerRef}
        my="3"
        sx={{
          backgroundColor: '#242424',
          maxHeight: 200,
          overflow: 'auto',
        }}
      >
        <Console logs={logs} variant="dark" />
      </Box>
    </>
  );
};

export default ConsoleFeed;
