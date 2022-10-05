import { Box } from '@mui/material';
import React, { FC } from 'react';
import Highlighter, { HighlighterProps } from 'react-highlight-words';

const ReactHighlighter: FC<HighlighterProps> = (props) => (
  <Box
    component="span"
    sx={{
      mark: {
        bgcolor: 'secondary.light',
      },
    }}
  >
    <Highlighter
      {...props}
      textToHighlight={props.textToHighlight?.toString() ?? ''}
    />
  </Box>
);

export default ReactHighlighter;
