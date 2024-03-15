require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const userRouter = require('./src/api/routes/users');
const { connectCloudinary } = require('./src/config/cloudinary');
const boardgameRouter = require('./src/api/routes/boardgames');

const app = express();
const PORT = 3000;

connectDB();
connectCloudinary();
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/boardgames', boardgameRouter);
app.use('*', (req, res, next) => {
  const error = new Error('Route not found 🦖');
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || 'Unexpected error');
});
app.listen(PORT, () => {
  console.log('Listening on http://localhost:' + PORT);
});
