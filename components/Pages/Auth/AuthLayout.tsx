import { Avatar, Box, Divider, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

export type AuthLayoutProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode | ReactNode[];
};

const AuthLayout: FC<AuthLayoutProps> = ({ children, title, icon }) => (
  <Box
    sx={{
      m: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '.MuiBox-root': {
        width: { xs: 1, sm: '500px' },
      },
    }}
  >
    <Box
      sx={{
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar
        sx={{
          m: 1,
          bgcolor: 'secondary.main',
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h5" textAlign="center">
        {title}
      </Typography>
    </Box>
    <Box sx={{ my: 1 }}>
      <Divider />
      {children}
    </Box>
  </Box>
);

export default AuthLayout;
