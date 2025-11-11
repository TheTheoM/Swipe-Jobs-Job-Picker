import React from 'react';
import { Box, Typography } from '@mui/material';
import { User } from 'lucide-react';

export const ReportTo: React.FC<{ reportToText: string }> = ({ reportToText }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderBottom: '1px solid #f0f0f0' }}>
    <User size={26} color='black' style={{ marginRight: 12, marginTop: 4 }} />
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
        Report To
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        {reportToText}
      </Typography>
    </Box>
  </Box>
);
