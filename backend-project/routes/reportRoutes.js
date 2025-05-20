const express = require('express');
const router = express.Router();
const {
  getRevenueReport,
  getPerformanceReport,
  getInventoryReport,
  getCustomerHistoryReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin access
router.use(protect);
router.use(authorize('admin'));

// Revenue report
router.get('/revenue', getRevenueReport);

// Performance report
router.get('/performance', getPerformanceReport);

// Inventory report
router.get('/inventory', getInventoryReport);

// Customer history report
router.get('/customer-history', getCustomerHistoryReport);

module.exports = router; 