import { deDE as coreDeDE } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/x-data-grid';

export const rawTheme = {};

const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#22942B',
        light: '#4AE057',
        dark: '#09470E',
      },
      secondary: {
        main: '#94224A',
        light: '#E04A7F',
        dark: '#47091F',
      },
    },
  },
  deDE,
  coreDeDE
);

export default theme;
