const { Payment, ServiceRecord, Car, Service } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const {
      serviceRecordId,
      amount,
      paymentDate,
      paymentMethod,
      status,
      transactionId,
      notes
    } = req.body;

    // Check if service record exists
    const serviceRecord = await ServiceRecord.findByPk(serviceRecordId);
    if (!serviceRecord) {
      await t.rollback();
      return res.status(404).json({ message: 'Service record not found' });
    }

    // Create payment
    const payment = await Payment.create({
      serviceRecordId,
      amount,
      paymentDate,
      paymentMethod,
      status,
      transactionId,
      notes
    }, { transaction: t });

    await t.commit();

    // Fetch the created payment with associations
    const createdPayment = await Payment.findByPk(payment.id, {
      include: [
        {
          model: ServiceRecord,
          include: [
            {
              model: Car,
              attributes: ['make', 'model', 'licensePlate']
            },
            {
              model: Service,
              attributes: ['name', 'basePrice']
            }
          ]
        }
      ]
    });

    res.status(201).json(createdPayment);
  } catch (error) {
    await t.rollback();
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: ServiceRecord,
          include: [
            {
              model: Car,
              attributes: ['make', 'model', 'licensePlate']
            },
            {
              model: Service,
              attributes: ['name', 'basePrice']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: ServiceRecord,
          include: [
            {
              model: Car,
              attributes: ['make', 'model', 'licensePlate']
            },
            {
              model: Service,
              attributes: ['name', 'basePrice']
            }
          ]
        }
      ]
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    console.error('Get payment by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
const updatePayment = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const payment = await Payment.findByPk(req.params.id);
    
    if (!payment) {
      await t.rollback();
      return res.status(404).json({ message: 'Payment not found' });
    }

    const {
      serviceRecordId,
      amount,
      paymentDate,
      paymentMethod,
      status,
      transactionId,
      notes
    } = req.body;

    // Check if service record exists if being updated
    if (serviceRecordId && serviceRecordId !== payment.serviceRecordId) {
      const serviceRecord = await ServiceRecord.findByPk(serviceRecordId);
      if (!serviceRecord) {
        await t.rollback();
        return res.status(404).json({ message: 'Service record not found' });
      }
    }

    // Update payment
    await payment.update({
      serviceRecordId,
      amount,
      paymentDate,
      paymentMethod,
      status,
      transactionId,
      notes
    }, { transaction: t });

    await t.commit();

    // Fetch the updated payment with associations
    const updatedPayment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: ServiceRecord,
          include: [
            {
              model: Car,
              attributes: ['make', 'model', 'licensePlate']
            },
            {
              model: Service,
              attributes: ['name', 'basePrice']
            }
          ]
        }
      ]
    });

    res.json(updatedPayment);
  } catch (error) {
    await t.rollback();
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private
const deletePayment = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const payment = await Payment.findByPk(req.params.id);
    
    if (!payment) {
      await t.rollback();
      return res.status(404).json({ message: 'Payment not found' });
    }

    await payment.destroy({ transaction: t });
    await t.commit();
    
    res.json({ message: 'Payment removed' });
  } catch (error) {
    await t.rollback();
    console.error('Delete payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get payments by service record ID
// @route   GET /api/payments/service-record/:serviceRecordId
// @access  Private
const getPaymentsByServiceRecord = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: {
        serviceRecordId: req.params.serviceRecordId
      },
      include: [
        {
          model: ServiceRecord,
          attributes: ['id', 'status', 'cost'],
          include: [
            {
              model: Car,
              attributes: ['make', 'model', 'licensePlate']
            }
          ]
        }
      ]
    });
    res.json(payments);
  } catch (error) {
    console.error('Get payments by service record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByServiceRecord,
}; 