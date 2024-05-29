import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

function Reminders() {
  const [reminder, setReminder] = useState({ description: '', date: '' });

  const handleChange = (e) => {
    setReminder({ ...reminder, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add reminder logic here
    console.log(reminder);
  };

  return (
    <Container maxWidth="sm" className="mt-10">
      <Typography variant="h4" component="h1" gutterBottom>
        Set Reminder
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <TextField
          label="Description"
          variant="outlined"
          name="description"
          value={reminder.description}
          onChange={handleChange}
        />
        <TextField
          label="Date"
          variant="outlined"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          name="date"
          value={reminder.date}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Set Reminder
        </Button>
      </form>
    </Container>
  );
}

export default Reminders;