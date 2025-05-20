const express = require('express');
const router = express.Router();
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createService)
  .get(protect, getServices);

router.route('/:id')
  .get(protect, getServiceById)
  .put(protect, updateService)
  .delete(protect, deleteService);

module.exports = router; 