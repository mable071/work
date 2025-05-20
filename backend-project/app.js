// Import routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const serviceRecordRoutes = require('./routes/serviceRecordRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-records', serviceRecordRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes); 