const { ServiceRecord, Car, Service, Payment, PartsUsed } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// @desc    Get service revenue report
// @route   GET /api/reports/revenue
// @access  Private
const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const whereClause = {};
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const payments = await Payment.findAll({
      where: whereClause,
      include: [
        {
          model: ServiceRecord,
          include: [
            {
              model: Service,
              attributes: ['name']
            }
          ]
        }
      ],
      attributes: [
        'amount',
        'paymentMethod',
        'status',
        'createdAt'
      ]
    });

    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Group by payment method
    const revenueByMethod = payments.reduce((acc, payment) => {
      const method = payment.paymentMethod;
      acc[method] = (acc[method] || 0) + payment.amount;
      return acc;
    }, {});

    // Group by service
    const revenueByService = payments.reduce((acc, payment) => {
      const serviceName = payment.ServiceRecord?.Service?.name || 'Unknown';
      acc[serviceName] = (acc[serviceName] || 0) + payment.amount;
      return acc;
    }, {});

    res.json({
      totalRevenue,
      revenueByMethod,
      revenueByService,
      payments
    });
  } catch (error) {
    console.error('Get revenue report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get service performance report
// @route   GET /api/reports/performance
// @access  Private
const getPerformanceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const whereClause = {};
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const serviceRecords = await ServiceRecord.findAll({
      where: whereClause,
      include: [
        {
          model: Service,
          attributes: ['name']
        },
        {
          model: PartsUsed,
          attributes: ['name', 'quantity', 'cost']
        }
      ],
      attributes: [
        'id',
        'status',
        'cost',
        'startDate',
        'endDate',
        'createdAt'
      ]
    });

    // Calculate service statistics
    const serviceStats = serviceRecords.reduce((acc, record) => {
      const serviceName = record.Service?.name || 'Unknown';
      if (!acc[serviceName]) {
        acc[serviceName] = {
          totalServices: 0,
          totalCost: 0,
          averageCost: 0,
          completedServices: 0
        };
      }
      
      acc[serviceName].totalServices++;
      acc[serviceName].totalCost += record.cost;
      if (record.status === 'completed') {
        acc[serviceName].completedServices++;
      }
      
      return acc;
    }, {});

    // Calculate average costs
    Object.keys(serviceStats).forEach(service => {
      serviceStats[service].averageCost = 
        serviceStats[service].totalCost / serviceStats[service].totalServices;
    });

    res.json({
      serviceStats,
      totalServices: serviceRecords.length,
      serviceRecords
    });
  } catch (error) {
    console.error('Get performance report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get inventory report
// @route   GET /api/reports/inventory
// @access  Private
const getInventoryReport = async (req, res) => {
  try {
    const partsUsed = await PartsUsed.findAll({
      attributes: [
        'name',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.literal('quantity * cost')), 'totalCost']
      ],
      group: ['name'],
      raw: true
    });

    const totalPartsCost = partsUsed.reduce((sum, part) => sum + parseFloat(part.totalCost), 0);

    res.json({
      partsInventory: partsUsed,
      totalPartsCost,
      totalUniqueParts: partsUsed.length
    });
  } catch (error) {
    console.error('Get inventory report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get customer service history report
// @route   GET /api/reports/customer-history
// @access  Private
const getCustomerHistoryReport = async (req, res) => {
  try {
    const { carId } = req.query;
    const whereClause = {};
    
    if (carId) {
      whereClause.carId = carId;
    }

    const serviceRecords = await ServiceRecord.findAll({
      where: whereClause,
      include: [
        {
          model: Car,
          attributes: ['make', 'model', 'licensePlate']
        },
        {
          model: Service,
          attributes: ['name', 'basePrice']
        },
        {
          model: PartsUsed,
          attributes: ['name', 'quantity', 'cost']
        },
        {
          model: Payment,
          attributes: ['amount', 'status', 'paymentMethod']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Group by car
    const carHistory = serviceRecords.reduce((acc, record) => {
      const carKey = `${record.Car.make} ${record.Car.model} (${record.Car.licensePlate})`;
      if (!acc[carKey]) {
        acc[carKey] = {
          totalServices: 0,
          totalSpent: 0,
          services: []
        };
      }
      
      acc[carKey].totalServices++;
      acc[carKey].totalSpent += record.Payments.reduce((sum, payment) => sum + payment.amount, 0);
      acc[carKey].services.push(record);
      
      return acc;
    }, {});

    res.json({
      carHistory,
      totalCars: Object.keys(carHistory).length,
      totalServices: serviceRecords.length
    });
  } catch (error) {
    console.error('Get customer history report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRevenueReport,
  getPerformanceReport,
  getInventoryReport,
  getCustomerHistoryReport
}; 