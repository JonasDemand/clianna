import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import ProfilePage from '@components/Profile/ProfilePage';
import { FC } from 'react';

const Profile: FC = () => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <ProfilePage />
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export default Profile;
