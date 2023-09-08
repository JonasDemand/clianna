import ProfilePage from '@components/Pages/Profile/ProfilePage';
import AuthenticationWrapper from '@components/Wrappers/AuthenticationWrapper';
import LayoutWrapper from '@components/Wrappers/LayoutWrapper';
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
