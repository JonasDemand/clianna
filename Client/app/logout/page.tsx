'use client';

import { Typography } from '@mui/material';
import { signOut } from 'next-auth/react';
import React, { useEffect } from 'react';

//TODO: remove (temporary page for old sessions)
const Logout = () => {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return <Typography>Logged out :)</Typography>;
};

export default Logout;
