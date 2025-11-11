import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Typography, Stack, Paper, Button } from '@mui/material';
import { Calendar, ChevronRight } from 'lucide-react';
import { formatShift } from '../../../utils/shiftFormat';

const modalRoot = document.getElementById('modal-root') || document.body;

interface Shift {
  startDate: string;
  endDate: string;
}

interface ShiftDatesProps {
  shifts: Shift[];
  timeZone: string;
}

export const ShiftDates: React.FC<ShiftDatesProps> = ({ shifts, timeZone }) => {
  const [open, setOpen] = useState(false);

  // Controls if to truncate shifts, and show popup window.
  const hasMultiple = shifts.length > 2;

  // Pop up window that shows a list of shifts.
  const ShiftModal = () =>
    ReactDOM.createPortal(
      <Box
        role='dialog'
        aria-modal='true'
        aria-label='All Shifts'
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1300,
        }}
        onClick={() => setOpen(false)}
      >
        <Paper
          sx={{
            p: 3,
            maxWidth: 400,
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography variant='h6' sx={{ mb: 2 }}>
            All Shifts
          </Typography>
          <Stack spacing={1} sx={{ width: '100%', mb: 2 }}>
            {shifts.map((shift, index) => (
              <Typography key={`${shift.startDate}-${shift.endDate}-${index}`} variant='body2'>
                {formatShift(shift, timeZone)}
              </Typography>
            ))}
          </Stack>
          <Button
            variant='contained'
            size='large'
            onClick={() => setOpen(false)}
            sx={{
              bgcolor: 'black',
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'none',
              width: '100%',
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        borderBottom: '1px solid #f0f0f0',
        cursor: hasMultiple ? 'pointer' : 'default',
      }}
      onClick={() => hasMultiple && setOpen(true)}
    >
      <Calendar size={24} color='black' style={{ marginRight: 12, marginTop: 4 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
          Shift Dates
        </Typography>
        <Stack spacing={0.25} sx={{ mt: 0.25 }}>
          {shifts.slice(0, 2).map((shift, index) => (
            <Typography key={`${shift.startDate}-${shift.endDate}-${index}`} variant='body2' color='text.primary'>
              {formatShift(shift, timeZone)}
            </Typography>
          ))}
          {hasMultiple && (
            <Typography variant='body2' color='text.primary'>
              +{shifts.length - 2} more...
            </Typography>
          )}
        </Stack>
      </Box>
      {hasMultiple && (
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={42} color='gray' />
        </Box>
      )}
      {open && <ShiftModal />}
    </Box>
  );
};
