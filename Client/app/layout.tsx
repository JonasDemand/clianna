import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/global.css';

import MuiGlobalBackdrop from '@components/External/MuiGlobalBackdrop';
import ProviderWrapper from '@components/Wrappers/ProviderWrapper';
import React, { ReactNode, Suspense } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Clianna Kundenverwaltung</title>
      </head>
      <body>
        <ProviderWrapper>
          <Suspense fallback={<MuiGlobalBackdrop open />}>{children}</Suspense>
        </ProviderWrapper>
      </body>
    </html>
  );
};

export default Layout;
