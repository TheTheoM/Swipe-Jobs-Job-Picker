import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

let theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#ddddddff' },
    primary: { main: '#30D5AB' },
    secondary: { main: '#000000' },
    text: { primary: '#000000', secondary: '#666666' },
  },
  typography: {
    fontFamily: 'sans-serif',
  },
});

theme = responsiveFontSizes(theme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
