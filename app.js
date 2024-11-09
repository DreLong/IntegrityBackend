// app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transactions');

const app = express();
app.use(bodyParser.json());

// Use the auth routes
app.use('/auth', authRoutes);

// Use the user routes
app.use('/users', userRoutes);

// Use the transaction routes
app.use("/transactions", transactionRoutes);

module.exports = app;
