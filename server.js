const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://nipunamunasinghe:Tahukanna1029@cluster0.4fjkbhv.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
 
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
const expenseRouter = require('./routes/expenses');
app.use('/api/expenses', expenseRouter);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
