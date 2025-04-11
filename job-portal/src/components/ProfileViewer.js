import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function ProfileViewer({ name, role, company }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="subtitle1">{role}</Typography>
        <Typography variant="body2">{company}</Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" size="small">View Profile</Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProfileViewer;