const express = require('express')
const connectDB = require('./utils/conn')
const cors = require('cors')

const app = express()
const port = 3000

connectDB();

const corsOptions = {
  origin: [ 'http://localhost:5173','https://vercel-frontend-rho-drab.vercel.app'],
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

// Apply CORS middleware to all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ extended: false }));

// // Custom middleware to handle OPTIONS requests explicitly
// app.use((req, res, next) => {
//   // If this is an OPTIONS request, handle it explicitly
//   if (req.method === 'OPTIONS') {
//     // Set CORS headers explicitly
//     res.header('Access-Control-Allow-Origin', corsOptions.origin);
//     res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
//     res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
//     res.header('Access-Control-Allow-Credentials', 'true');
    
//     // You can also add Access-Control-Max-Age if needed
//     res.header('Access-Control-Max-Age', '86400'); // 24 hours
    
//     // Send 200 OK status and end the response
//     return res.status(200).end();
//   }
  
//   // For non-OPTIONS requests, continue to the next middleware
//   return next();
// });

// Your routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/complaint', require('./routes/complaintRoutes'));
app.use('/api/invoice', require('./routes/invoiceRoutes'));
app.use('/api/messoff', require('./routes/messoffRoutes'));
app.use('/api/request', require('./routes/requestRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/suggestion', require('./routes/suggestionRoutes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})