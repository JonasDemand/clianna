'use client';

import BackdropProvider from '@context/BackdropContext';
import { ThemeProvider } from '@emotion/react';
import { Slide } from '@mui/material';
import theme from '@utils/theme';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import React, { FC, ReactNode } from 'react';

export type ProviderWrapperProps = {
  session?: Session | null;
  children: ReactNode;
};

const ProviderWrapper: FC<ProviderWrapperProps> = ({ session, children }) => {
  return (
    //@ts-ignore
    <ThemeProvider theme={theme}>
      {/* @ts-ignore*/}
      <SessionProvider session={session}>
        {/* @ts-ignore*/}
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          TransitionComponent={Slide}
        >
          {/* @ts-ignore*/}
          <BackdropProvider>{children}</BackdropProvider>
        </SnackbarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default ProviderWrapper;
