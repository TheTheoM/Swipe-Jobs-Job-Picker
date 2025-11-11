import { Container, Box, Typography } from '@mui/material';
import { Search } from 'lucide-react';
import Header from './Header';

const NoJobsFoundCard = ({ userName }: { userName: string }) => (
  <Container maxWidth='sm' sx={{ py: 4, minHeight: '100vh', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
    <Header name={userName} />
    <Box sx={{ bgcolor: 'white', boxShadow: 3, minHeight: '60vh', p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Search size={64} color='grey' style={{ marginBottom: 64 }} />
      <Typography variant='h5' fontWeight='bold' mb={1}>
        Sorry, no jobs found right now!
      </Typography>
      <Typography>Please check back later or consider changing your job filters to expand your search.</Typography>
    </Box>
  </Container>
);

export default NoJobsFoundCard;
