const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./passport');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

const app = express();

app.use(cors({origin: process.env.FRONTEND_URL}));
app.use(express.json());
app.use(passport.initialize());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/auth', authRoutes);
app.use('/task', taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));