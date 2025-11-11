import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Wrench } from 'lucide-react';

interface RequirementsProps {
  requirements?: string[] | null;
}

export const Requirements: React.FC<RequirementsProps> = ({ requirements }) => {
  const hasRequirements = Array.isArray(requirements) && requirements.length > 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 1.5, borderBottom: '1px solid #f0f0f0' }}>
      <Wrench size={24} color='black' style={{ marginRight: 12, marginTop: 4 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant='body1' sx={{ fontWeight: 'bold', mb: 0.5 }}>
          Requirements
        </Typography>
        {hasRequirements ? (
          <Stack
            spacing={0.25}
            sx={{
              maxHeight: 100,
              overflowY: 'auto',
              pr: 1,
            }}
          >
            {requirements.map((req, i) => (
              <Typography key={i} variant='body2' color='text.secondary'>
                - {req}
              </Typography>
            ))}
          </Stack>
        ) : (
          <Typography variant='body2' color='text.secondary'>
            N/A
          </Typography>
        )}
      </Box>
    </Box>
  );
};
