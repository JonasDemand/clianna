import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import { Typography } from '@mui/material';
import { FC } from 'react';

const Profile: FC = () => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <Typography>Howdy :) this is your profile</Typography>
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export default Profile;
