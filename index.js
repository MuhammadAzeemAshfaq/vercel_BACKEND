const express = require('express')
const connectDB = require('./utils/conn')
const cors = require('cors')

const app = express()
const port = 3000

connectDB();

const corsOptions = {
  origin: 'https://vercel-frontend-rho-drab.vercel.app',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Date',
    'X-Api-Version'
  ],
  credentials: true
};

// 1) add CORS headers on **every** request
app.use(cors(corsOptions));

// 2) explicitly respond to **all** OPTIONS preflight requests
app.options('*', (req, res) => {
  // you could also use cors(corsOptions) here:
  res
    .header('Access-Control-Allow-Origin', corsOptions.origin)
    .header('Access-Control-Allow-Methods', corsOptions.methods.join(','))
    .header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','))
    .header('Access-Control-Allow-Credentials', 'true')
    .header("HTTP/1.1 200 OK");
});

app.options('*', (req, res) => {
  res.status(200).end();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/complaint', require('./routes/complaintRoutes'));
app.use('/api/invoice', require('./routes/invoiceRoutes'));
app.use('/api/messoff', require('./routes/messoffRoutes'));
app.use('/api/request', require('./routes/requestRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/suggestion', require('./routes/suggestionRoutes'));

module.exports = app;
