import ApiProvider from '@context/ApiContext';
import BackdropProvider from '@context/BackdropContext';
import { ThemeProvider } from '@emotion/react';
import { Slide } from '@mui/material';
import theme from '@utils/theme';
import { SnackbarProvider } from 'notistack';
import React, { FC, ReactNode } from 'react';

export type ProviderWrapperProps = {
  children: ReactNode;
};

const ProviderWrapper: FC<ProviderWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        TransitionComponent={Slide}
      >
        <BackdropProvider>
          <ApiProvider>{children}</ApiProvider>
        </BackdropProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default ProviderWrapper;
