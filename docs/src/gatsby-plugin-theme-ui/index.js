export default {
  breakpoints: ['40em', '52em', '64em'],
  colors: {
    text: '#0c0c0d',
    background: '#fff',
    primary: '#0c0c0d',
    secondary: '#61dafb',
  },
  fonts: {
    body: '"Source Sans Pro", "Helvetica Neue", Arial, sans-serif',
    heading: '"Source Sans Pro", "Helvetica Neue", Arial, sans-serif',
    monospace: 'Menlo, monospace'
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  fontSizes: [14, 16, 22, 27, 32, 48, 64, 72],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    container: 1140,
  },
  styles: {
    brand: {
      fontFamily: 'body',
      textDecoration: 'none',
      color: 'text',
      fontSize: 1,
      px: 2,
    },
    navlink: {
      p: 2,
      fontFamily: 'body',
      color: 'text',
      textDecoration: 'none',
      borderRadius: 3,
      border: 0,
      background: '#fff',
      '&:hover': {
        background: '#eee',
      },
      cursor: 'pointer',
      fontSize: 1,
      outline: 0,
    },
    h1: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
      fontSize: 2,
      marginTop: 0,
      marginBottom: 3,
    },
    a: {
      color: "primary",
      ":hover, :focus": {
        color: "secondary",
      },
    },
  },
}