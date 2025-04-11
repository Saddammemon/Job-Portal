import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function JobCard({ title, company, location, date }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="subtitle1">{company}</Typography>
        <Typography variant="body2">{location}</Typography>
        {date && <Typography variant="caption">Applied on {date}</Typography>} 
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" size="small">View Jobs</Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default JobCard;