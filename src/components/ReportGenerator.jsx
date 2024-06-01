import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Container, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { instance } from '../api/auth';
import { saveAs } from 'file-saver';
import { fetchCategories } from '../store/reducers/categoriesSlice';

const ReportGenerator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [reportData, setReportData] = useState(null);

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedCategories(categories);
    } else {
      setSelectedCategories(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post('/api/report', {
        startDate,
        endDate,
        transactionType,
        categories: selectedCategories.includes('all') ? categories : selectedCategories,
      });
      setReportData(response.data);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const handleDownload = () => {
    const doc = new Blob([reportData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(doc, `Financial_Report_${startDate}_to_${endDate}.docx`);
  };

  return (
    <Container className='py-16'>
      <h1 className='text-3xl font-bold mx-auto text-center mb-6'>Генерация Финансового Отчета</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Дата начала"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            className='bg-white'
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Дата окончания"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            className='bg-white'
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="transaction-type-label">Тип операций</InputLabel>
          <Select
            labelId="transaction-type-label"
            value={transactionType}
            className='bg-white'
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="income">Доходы</MenuItem>
            <MenuItem value="expense">Расходы</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="categories-label">Категории</InputLabel>
          <Select
            labelId="categories-label"
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            renderValue={(selected) => selected.join(', ')}
            className='bg-white'
          >
            <MenuItem value="all">
              <em>Все</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth className='!py-3 !mt-2 !rounded-xl !font-semibold'>Сгенерировать отчет</Button>
      </form>
      {reportData && (
        <Box mt={4}>
          <Typography variant="h6" component="h3" gutterBottom>Результаты Отчета</Typography>
          <pre>{JSON.stringify(reportData, null, 2)}</pre>
          <Button variant="contained" color="secondary" onClick={handleDownload} className='!py-3 !rounded-xl !font-semibold'>Скачать в DOCX</Button>
        </Box>
      )}
    </Container>
  );
};

export default ReportGenerator;