import React from 'react';
import { Container, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';

function Analysis() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Expenses',
        data: [300, 200, 250, 220, 500],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <Container maxWidth="md" className="mt-10">
      <Typography variant="h4" component="h1" gutterBottom>
        Expense Analysis
      </Typography>
      <div className="p-4 border rounded shadow-sm">
        <Bar data={data} />
      </div>
    </Container>
  );
}

export default Analysis;