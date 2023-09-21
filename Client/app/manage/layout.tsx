import Navbar from '@components/Layout/Navbar';
import Userprofile from '@components/Layout/Userprofile';
import { AppBar, Box, Container, Toolbar } from '@mui/material';
import React, { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
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
      <Box sx={{ p: 2, flex: '1 1 auto' }}>{children}</Box>
    </Box>
  );
};

export default Layout;
