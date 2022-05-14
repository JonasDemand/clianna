import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/global.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { ThemeProvider } from '@emotion/react';
import theme from '../utils/theme';
import CustomerProvider from '../context/customerContext';
import { SnackbarProvider } from 'notistack';
import { Slide } from '@mui/material';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>aufTritt Kundenverwaltung</title>
      </Head>
      <SessionProvider session={session}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          TransitionComponent={Slide}
        >
          <CustomerProvider>
            <Component {...pageProps} />
          </CustomerProvider>
        </SnackbarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default MyApp;
