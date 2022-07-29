import { AppBar, Box, Container, Toolbar } from '@mui/material';
import { FC, ReactNode } from 'react';

import Navbar from './Navbar';
import Userprofile from './Userprofile';

type LayoutWrapperProps = {
  children: ReactNode;
};

const LayoutWrapper: FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column',
        height: '100vh',
      }}
    >
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Navbar />
            <Userprofile />
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ p: 1, flex: '1 1 auto' }}>{children}</Box>
    </Box>
  );
};

export default LayoutWrapper;
