const { ServiceRecord, Car, Service, PartsUsed } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// @desc    Get all service records
// @route   GET /api/service-records
// @access  Private
const getServiceRecords = async (req, res) => {
  try {
    const serviceRecords = await ServiceRecord.findAll({
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
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(serviceRecords);
  } catch (error) {
    console.error('Get service records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get service record by ID
// @route   GET /api/service-records/:id
// @access  Private
const getServiceRecordById = async (req, res) => {
  try {
    const serviceRecord = await ServiceRecord.findByPk(req.params.id, {
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
        }
      ]
    });
    
    if (!serviceRecord) {
      return res.status(404).json({ message: 'Service record not found' });
    }
    
    res.json(serviceRecord);
  } catch (error) {
    console.error('Get service record by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a service record
// @route   POST /api/service-records
// @access  Private
const createServiceRecord = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const {
      carId,
      serviceId,
      startDate,
      endDate,
      status,
      cost,
      technician,
      notes,
      partsUsed
    } = req.body;

    // Create service record
    const serviceRecord = await ServiceRecord.create({
      carId,
      serviceId,
      startDate,
      endDate,
      status,
      cost,
      technician,
      notes
    }, { transaction: t });

    // Create parts used if any
    if (partsUsed && partsUsed.length > 0) {
      await PartsUsed.bulkCreate(
        partsUsed.map(part => ({
          ...part,
          serviceRecordId: serviceRecord.id
        })),
        { transaction: t }
      );
    }

    await t.commit();

    // Fetch the created record with associations
    const createdRecord = await ServiceRecord.findByPk(serviceRecord.id, {
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
        }
      ]
    });

    res.status(201).json(createdRecord);
  } catch (error) {
    await t.rollback();
    console.error('Create service record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a service record
// @route   PUT /api/service-records/:id
// @access  Private
const updateServiceRecord = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const serviceRecord = await ServiceRecord.findByPk(req.params.id);
    
    if (!serviceRecord) {
      await t.rollback();
      return res.status(404).json({ message: 'Service record not found' });
    }

    const {
      carId,
      serviceId,
      startDate,
      endDate,
      status,
      cost,
      technician,
      notes,
      partsUsed
    } = req.body;

    // Update service record
    await serviceRecord.update({
      carId,
      serviceId,
      startDate,
      endDate,
      status,
      cost,
      technician,
      notes
    }, { transaction: t });

    // Update parts used if provided
    if (partsUsed) {
      // Delete existing parts
      await PartsUsed.destroy({
        where: { serviceRecordId: serviceRecord.id },
        transaction: t
      });

      // Create new parts
      if (partsUsed.length > 0) {
        await PartsUsed.bulkCreate(
          partsUsed.map(part => ({
            ...part,
            serviceRecordId: serviceRecord.id
          })),
          { transaction: t }
        );
      }
    }

    await t.commit();

    // Fetch the updated record with associations
    const updatedRecord = await ServiceRecord.findByPk(req.params.id, {
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
        }
      ]
    });

    res.json(updatedRecord);
  } catch (error) {
    await t.rollback();
    console.error('Update service record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a service record
// @route   DELETE /api/service-records/:id
// @access  Private
const deleteServiceRecord = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const serviceRecord = await ServiceRecord.findByPk(req.params.id);
    
    if (!serviceRecord) {
      await t.rollback();
      return res.status(404).json({ message: 'Service record not found' });
    }

    // Delete associated parts
    await PartsUsed.destroy({
      where: { serviceRecordId: serviceRecord.id },
      transaction: t
    });

    // Delete service record
    await serviceRecord.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Service record removed' });
  } catch (error) {
    await t.rollback();
    console.error('Delete service record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get service records by car ID
// @route   GET /api/service-records/car/:carId
// @access  Private
const getServiceRecordsByCar = async (req, res) => {
  try {
    const serviceRecords = await ServiceRecord.findAll({
      where: {
        carId: req.params.carId
      },
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
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(serviceRecords);
  } catch (error) {
    console.error('Get service records by car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getServiceRecords,
  getServiceRecordById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
  getServiceRecordsByCar
}; 