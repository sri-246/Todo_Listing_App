const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./passport');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

const app = express();

const corsOptions = {
  origin: 'https://todoapp-85mm.onrender.com',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(passport.initialize());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));