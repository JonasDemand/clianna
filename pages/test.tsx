import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import { LoadingButton } from '@mui/lab';
import { Box, Link } from '@mui/material';
import { NextPage } from 'next';
import { useState } from 'react';

const Test: NextPage = () => {
  const [document, setDocument] = useState<string>();
  const [loading, setLoading] = useState(false);

  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <LoadingButton
          loading={loading}
          variant="contained"
          onClick={async () => {
            setLoading(true);
            const res = await fetch('/api/gapi');
            const body = await res.json();
            setDocument(body.link);
            setLoading(false);
          }}
        >
          Erstelle Dokument
        </LoadingButton>
        {document && (
          <Box sx={{ mt: 2 }}>
            <Link variant="h6" target="_blank" href={document}>
              Link zum erstellten Dokument
            </Link>
          </Box>
        )}
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export default Test;
