const express = require('express');
const router = express.Router();
const {
  createServiceRecord,
  getServiceRecords,
  getServiceRecordById,
  updateServiceRecord,
  deleteServiceRecord,
  getServiceRecordsByCar,
} = require('../controllers/serviceRecordController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createServiceRecord)
  .get(protect, getServiceRecords);

router.route('/:id')
  .get(protect, getServiceRecordById)
  .put(protect, updateServiceRecord)
  .delete(protect, deleteServiceRecord);

router.get('/car/:carId', protect, getServiceRecordsByCar);

module.exports = router; 