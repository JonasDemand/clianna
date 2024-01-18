import { Box } from '@mui/material';
import React, { FC } from 'react';
import { HighlighterProps } from 'react-highlight-words';

const ReactHighlighter: FC<HighlighterProps> = (props) => (
  <Box
    component="span"
    sx={{
      mark: {
        bgcolor: 'secondary.light',
      },
    }}
  >
    {/*TODO: add highlighter again
    <Highlighter
      {...props}
      textToHighlight={props.textToHighlight?.toString() ?? ''}
    />*/
    props.textToHighlight?.toString()}
  </Box>
);

export default ReactHighlighter;
