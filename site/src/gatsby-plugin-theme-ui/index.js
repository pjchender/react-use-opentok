export default {
  breakpoints: ['40em', '52em', '64em'],
  colors: {
    text: '#37352f',
    background: '#fff',
    primary: 'rgba(55,53,47,0.6)',
    secondary: '#eb5757',
  },
  fonts: {
    body: '"Source Sans Pro", "Helvetica Neue", Arial, sans-serif',
    heading: '"Source Sans Pro", "Helvetica Neue", Arial, sans-serif',
    monospace: 'Menlo, monospace',
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
  buttons: {
    primary: {
      cursor: 'pointer',
      color: 'text',
      p: 2,
      borderRadius: 3,
      border: 0,
      backgroundColor: 'background',
      '&:hover': {
        background: '#eee',
      },
      cursor: 'pointer',
      fontSize: 1,
      '&:focus': {
        outline: '0 none',
      },
      marginRight: 2,
      '&:last-child': {
        marginRight: 0,
      },
    },
    secondary: {
      cursor: 'pointer',
      color: 'secondary',
      backgroundColor: 'background',
      '&:hover': {
        background: 'rgba(235, 87, 87, 0.06)',
      },
      borderColor: 'secondary',
      borderWidth: 1,
      borderStyle: 'solid',
      '&:focus': {
        outline: '0 none',
      },
      marginRight: 2,
      '&:last-child': {
        marginRight: 0,
      },
      '&[disabled]': {
        cursor: 'not-allowed',
      },
    },
  },
  badges: {
    outline: {
      color: '#fff',
      bg: 'secondary',
    },
  },
  forms: {
    label: {
      color: 'text',
      fontWeight: 'bold',
    },
    input: {
      fontSize: 0,
      borderColor: 'primary',
      color: 'text',
      '&:focus': {
        borderColor: 'text',
        outline: '0 none',
        transition: 'border-color 0.3s',
      },
    },
    textarea: {
      fontSize: 0,
      borderColor: 'primary',
      color: 'text',
      '&:focus': {
        borderColor: 'text',
        outline: '0 none',
        transition: 'border-color 0.3s',
      },
    },
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
      outline: '0 none',
    },
    h1: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
      fontSize: 2,
      marginTop: 0,
      marginBottom: 3,
    },
    a: {
      color: 'primary',
      ':hover, :focus': {
        color: 'secondary',
      },
    },
  },
};
