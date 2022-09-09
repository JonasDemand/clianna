import { Google } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { FC, useState } from 'react';

import AuthLayout from '../AuthLayout';
import CredentialsForm from '../CredentailsForm';

const LinkPage: FC = () => {
  const [error, setError] = useState<string>();

  return (
    <AuthLayout
      title="Bestätige die Verbindung mit deinem Google-Account"
      icon={<Google />}
    >
      <CredentialsForm showError={setError} />
      {error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}
    </AuthLayout>
  );
};

export default LinkPage;
