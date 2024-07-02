import { createTheme } from '@mui/material/styles';

// Create a custom dark theme
const theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: '#ffffff', // Custom primary color
    },
    secondary: {
      main: '#f48fb1', // Custom secondary color
    },
  },
  components: {
    
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:-webkit-autofill': {
            '-webkit-box-shadow': '0 0 0 100px #121212 inset',
            '-webkit-text-fill-color': '#fff',
            caretColor: '#fff',
            borderRadius: 'inherit',
          },
        },
        input: {
          '&:-webkit-autofill': {
            '-webkit-box-shadow': '0 0 0 100px #121212 inset',
            '-webkit-text-fill-color': '#fff',
            caretColor: '#fff',
            borderRadius: 'inherit',
          },
        },
      },
    },
  },
});

export default theme;
