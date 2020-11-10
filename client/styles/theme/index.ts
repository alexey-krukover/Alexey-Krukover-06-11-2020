import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#0078d4',
    },
    secondary: {
      main: 'rgb(143 164 177)',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f3f2f1',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  }
});;
