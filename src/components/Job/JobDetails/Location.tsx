import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Typography, Paper, Button } from '@mui/material';
import { MapPin, ChevronRight } from 'lucide-react';

const modalRoot = document.getElementById('modal-root') || document.body;
interface LocationProps {
  address: string;
  distanceFromSearch?: string | null;
}

export const Location: React.FC<LocationProps> = ({ address, distanceFromSearch }) => {
  const [open, setOpen] = useState(false);

  // Displays a popup-window with a map.
  const LocationModal = () =>
    ReactDOM.createPortal(
      <Box
        role='dialog'
        aria-modal='true'
        aria-label='Job Location'
        sx={{
          position: 'fixed',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1300,
        }}
        onClick={() => setOpen(false)}
      >
        <Paper sx={{ p: 2, width: '90%', maxWidth: 500, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
          <Typography variant='h6' mb={2}>
            Job Location
          </Typography>
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
            width='100%'
            height='300'
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            title='Job Location Map'
          />
          <Button
            fullWidth
            variant='contained'
            onClick={() => setOpen(false)}
            sx={{
              mt: 2,
              bgcolor: 'black',
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': { bgcolor: '#333' },
            }}
          >
            Close
          </Button>
        </Paper>
      </Box>,
      modalRoot,
    );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          borderBottom: '1px solid #f0f0f0',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      >
        <MapPin size={25} color='black' style={{ marginRight: 12 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant='body1' fontWeight='bolder'>
            Location
          </Typography>
          <Typography variant='body1'>{address}</Typography>
          {distanceFromSearch && (
            <Typography variant='body1' fontSize={13} mt={0.5}>
              {distanceFromSearch} miles from your job search location
            </Typography>
          )}
        </Box>
        <ChevronRight size={42} color='gray' />
      </Box>
      {open && <LocationModal />}
    </>
  );
};
