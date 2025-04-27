const express = require('express')
const connectDB = require('./utils/conn')
const cors = require('cors')

const app = express()
const port = 3000

connectDB();

var whitelist = ["http://localhost:5173", "https://vercel-frontend-rho-drab.vercel.app/"];
var corsOptions = { origin: whitelist, credentials: true };

app.use(cors(corsOptions));

app.use(express.json({ extended: false }));

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
