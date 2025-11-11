import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

const ErrorFallback: React.FC<{ message?: string }> = ({ message }) => {
  const retry = () => {
    window.location.reload();
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          bgcolor: 'error.light',
          color: 'error.contrastText',
          borderRadius: 2,
        }}
      >
        <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
          Oops, something went wrong
        </Typography>
        <Typography variant='body1' sx={{ mb: 3 }}>
          Refresh the page or try again in a few minutes.
        </Typography>
        {message && (
          <Typography variant='body2' sx={{ mb: 3 }}>
            {message}
          </Typography>
        )}
        <Button variant='contained' color='error' onClick={retry} sx={{ fontWeight: 'bold', textTransform: 'none' }}>
          Try again?
        </Button>
      </Paper>
    </Box>
  );
};

export default ErrorFallback;
