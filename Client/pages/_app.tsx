import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/global.css';

import ProviderWrapper from '@components/Wrappers/ProviderWrapper';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ProviderWrapper>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Clianna Kundenverwaltung</title>
      </Head>
      <Component {...pageProps} />
    </ProviderWrapper>
  );
};

export default MyApp;
