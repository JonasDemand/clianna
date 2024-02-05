'use client';

import { Typography } from '@mui/material';
import React, { useEffect } from 'react';

//TODO: remove (temporary page for old sessions)
const Logout = () => {
  useEffect(() => {
    //TODO signOut({ callbackUrl: '/' });
  }, []);

  return <Typography>Logged out :)</Typography>;
};

export default Logout;
