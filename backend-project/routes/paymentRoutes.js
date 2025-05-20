const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByServiceRecord,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createPayment)
  .get(protect, getPayments);

router.route('/:id')
  .get(protect, getPaymentById)
  .put(protect, updatePayment)
  .delete(protect, deletePayment);

router.get('/service-record/:serviceRecordId', protect, getPaymentsByServiceRecord);

module.exports = router; 