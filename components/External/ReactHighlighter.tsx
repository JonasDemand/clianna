import { Box } from '@mui/material';
import { FC } from 'react';
import Highlighter, { HighlighterProps } from 'react-highlight-words';

const ReactHighlighter: FC<HighlighterProps> = (props) => (
  <Box
    sx={{
      mark: {
        bgcolor: 'secondary.light',
      },
    }}
  >
    <Highlighter {...props} />
  </Box>
);

export default ReactHighlighter;
