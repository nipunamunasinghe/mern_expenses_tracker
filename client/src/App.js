import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Box,
  formControlClasses,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';


const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(null);
  const [editExpense, setEditExpense] = useState(null);
  const [deleteExpense, setDeleteExpense] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/expenses') // Update the URL here
      .then((response) => {
        setExpenses(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleAddExpense = () => {
    const newExpense = { title, amount, date};
  
    axios
      .post('http://localhost:5000/api/expenses/add', newExpense)
      .then(() => {
        setTitle('');
        setAmount('');
        setDate(null); // Reset the selected date value
  
        axios
          .get('http://localhost:5000/api/expenses')
          .then((response) => {
            setExpenses(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  

  const handleDeleteExpense = (id) => {
    axios
      .delete(`http://localhost:5000/api/expenses/${id}`) // Update the URL here
      .then(() => {
        axios
          .get('http://localhost:5000/api/expenses') // Update the URL here
          .then((response) => {
            setExpenses(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateExpense = (id, updatedExpense) => {
    const updatedExpenseData = { ...updatedExpense, date: updatedExpense.date.toISOString() };
  
    axios
      .post(`http://localhost:5000/api/expenses/update/${id}`, updatedExpenseData)
      .then(() => {
        setEditExpense(null);
        axios
          .get('http://localhost:5000/api/expenses')
          .then((response) => {
            setExpenses(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenEditDialog = (expense) => {
    setEditExpense(expense);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleFormSubmit = () => {
    handleUpdateExpense(editExpense._id, editExpense);
    handleCloseEditDialog();
  };

  const handleOpenDeleteDialog = (expense) => {
    setDeleteExpense(expense);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirmed = () => {
    handleDeleteExpense(deleteExpense._id);
    handleCloseDeleteDialog();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" sx={{ marginTop: '10px' }}>
          Expenses Tracker
        </Typography>
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} color="primary" />

        {/* Expenses Form */}
        <Box component="form" sx={{ marginTop: 2 }}>
          <TextField
            type="text"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Amount"
            type="number"
           inputProps={{ min: '0.01', step: '0.01' }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />

            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select date"
              className="form-control"
            />

          <Box textAlign={'center'}>
            <Button type="submit" variant="contained" onClick={handleAddExpense}>
              Add Expense
            </Button>
          </Box>
        </Box>

        {/* Expenses List */}
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>${expense.amount}</TableCell>
                  <TableCell>{new Date(expense.date).toISOString().split('T')[0]}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEditDialog(expense)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(expense)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Expense Dialog */}
        {editExpense && (
          <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <TextField
                  type="text"
                  label="Title"
                  value={editExpense.title}
                  onChange={(e) => setEditExpense({ ...editExpense, title: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Amount"
                  type="number"
                  inputProps={{ min: '0.01', step: '0.01' }}
                  value={editExpense.amount}
                  onChange={(e) => setEditExpense({ ...editExpense, amount: e.target.value })}
                  fullWidth
                  margin="normal"
                />
                
              
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              <Button onClick={handleFormSubmit}>Update Expense</Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Delete Expense Dialog */}
        {deleteExpense && (
          <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete the expense?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button onClick={handleDeleteConfirmed} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;