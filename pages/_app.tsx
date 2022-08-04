import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/global.css';

import BackdropProvider from '@context/BackdropContext';
import { ThemeProvider } from '@emotion/react';
import { Slide } from '@mui/material';
import theme from '@utils/theme';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const router = useRouter();

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
          <BackdropProvider>
            <Component {...pageProps} />
          </BackdropProvider>
        </SnackbarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default MyApp;
