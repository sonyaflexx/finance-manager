import React from 'react';
import { Container, Typography } from '@mui/material';

function Reports() {
  // Replace with actual report fetching logic
  const reports = [
    { id: 1, title: 'January Report', summary: 'Summary of January expenses' },
    { id: 2, title: 'February Report', summary: 'Summary of February expenses' },
  ];

  return (
    <Container maxWidth="md" className="mt-10">
      <Typography variant="h4" component="h1" gutterBottom>
        Financial Reports
      </Typography>
      <div className="space-y-4">
        {reports.map(report => (
          <div key={report.id} className="p-4 border rounded shadow-sm">
            <Typography variant="h6">{report.title}</Typography>
            <p>{report.summary}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Reports;
