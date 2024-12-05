import React from 'react';
import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Añade esta importación

// ----------------------------------------------------------------------
const theme = createTheme({
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            fontSize: '0.8rem',
          },
        },
      },
    },
  },
});

const RHFTextField = React.forwardRef(({ name, ...other }, ref) => {
  const { control } = useFormContext();

  return (
    <ThemeProvider theme={theme}> {/* Aplica el tema personalizado */}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <TextField
              {...field}
              fullWidth
              value={field.value !== undefined ? field.value : ''}
              error={!!error}
              helperText={error?.message}
              ref={ref}
              {...other}
            />
          </>
        )}
      />
    </ThemeProvider>
  );
});

// Agrega el displayName
RHFTextField.displayName = 'RHFTextField';

RHFTextField.propTypes = {
  name: PropTypes.string,
};

export default RHFTextField;
