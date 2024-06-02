import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Container, Typography, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as XLSX from 'xlsx';
import TransactionsList from './TransactionsList';

const ReportGenerator = () => {
  const categories = useSelector((state) => state.categories);
  const transactions = useSelector((state) => state.transactions.transactions);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState(categories.map(category => category.id));
  const [reportData, setReportData] = useState(null);
  const loading = false;

  const resultRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    if (!endDate) {
      setEndDate(now.toISOString().split('T')[0]);
    }
    if (!startDate) {
      setStartDate(transactions.reduce((minDate, transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate < minDate ? transactionDate : minDate;
      }, now).toISOString().split('T')[0]);
    }
  }, [categories, transactions]);


  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedCategories(categories.map(category => category.id));
    } else {
      setSelectedCategories(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const startDateMs = Date.parse(startDateObj);
      const endDateMs = Date.parse(endDateObj);
      const dateMs = Date.parse(date);
      const isInDateRange = dateMs >= startDateMs && dateMs <= endDateMs;
      const isCorrectType = transactionType === 'all' || transaction.type === transactionType;
      const isCorrectCategory = selectedCategories.includes(transaction.category_id);
      return isInDateRange && isCorrectType && isCorrectCategory;
    });
    setReportData(filteredTransactions);
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Moscow' };
    return new Date(date).toLocaleDateString('ru-RU', options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
  };

  const formatTransactionType = (type) => {
    return type === 'expense' ? 'Расходы' : 'Доходы';
  };

  const handleDownloadDocx = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: reportData.map(transaction => (
          new Paragraph({
            children: [
              new TextRun({
                text: `Дата: ${formatDate(transaction.date)}`,
                break: 1,
              }),
              new TextRun({
                text: `Тип: ${formatTransactionType(transaction.type)}`,
                break: 1,
              }),
              new TextRun({
                text: `Категория: ${categories.find(cat => cat.id === transaction.category_id)?.title}`,
                break: 1,
              }),
              new TextRun({
                text: `Кол-во: ${formatAmount(transaction.amount)}`,
                break: 1,
              }),
            ],
          })
        )),
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Financial_Report_${startDate}_to_${endDate}.docx`);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData.map(transaction => ({
      "Дата": formatDate(transaction.date),
      "Тип": formatTransactionType(transaction.type),
      "Категория": categories.find(cat => cat.id === transaction.category_id)?.title,
      "Кол-во": formatAmount(transaction.amount),
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `Financial_Report_${startDate}_to_${endDate}.xlsx`);
  };

  return (
    <Container className='py-16'>
      <h1 className='text-3xl font-bold mx-auto text-center mb-6'>Генерация финансового отчета</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Дата начала"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
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
            renderValue={(selected) => (
              selected.map(catId => categories.find(category => category.id === catId).title).join(', ')
            )}
            className='bg-white'
          >
            <MenuItem value="all">
              <em>Все</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth className='!py-3 !mt-2 !rounded-xl !font-semibold'>Сгенерировать отчет</Button>
      </form>
      {loading && (
        <Box mt={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      {reportData && !loading && (
        <>
          <Box mt={5} ref={resultRef}>
            <span className='text-2xl font-semibold'>Результаты отчета</span>
            <TransactionsList transactions={reportData} className="h-[700px] mt-4 bg-gray-200 p-2 rounded-xl" />
          </Box>
          {reportData.length > 0 && (
            <Box mt={4} display="flex" justifyContent="left" gap={2}>
              <Button variant="contained" color="primary" onClick={handleDownloadDocx} className='!py-3 !rounded-xl !font-semibold'>Скачать в DOCX</Button>
              <Button variant="contained" color="success" onClick={handleDownloadExcel} className='!py-3 !rounded-xl !font-semibold'>Скачать в Excel</Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ReportGenerator;