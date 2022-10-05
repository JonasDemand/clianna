import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import ProfilePage from '@components/Pages/Profile/ProfilePage';
import { NextPage } from 'next';
import React from 'react';

const Profile: NextPage = () => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <ProfilePage />
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export default Profile;
