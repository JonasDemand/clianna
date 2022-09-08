import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import MuiButton from '@components/External/MuiButton';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import { Box, Link } from '@mui/material';
import { NextPage } from 'next';
import { useState } from 'react';

const Test: NextPage = () => {
  const [document, setDocument] = useState<string>();
  const [loading, setLoading] = useState(false);

  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <MuiButton
          loadingButton
          loading={loading}
          onClick={async () => {
            setLoading(true);
            const res = await fetch('/api/gapi');
            const body = await res.json();
            setDocument(body.link);
            setLoading(false);
          }}
        >
          Erstelle Dokument
        </MuiButton>
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
