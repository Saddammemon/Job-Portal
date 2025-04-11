import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function StatisticsCard({ title, value }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="subtitle1">{title}</Typography>
      </CardContent>
    </Card>
  );
}

export default StatisticsCard;