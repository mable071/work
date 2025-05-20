const { Service } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all services
// @route   GET /api/services
// @access  Private
const getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [['name', 'ASC']]
    });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Private
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private
const createService = async (req, res) => {
  try {
    const { name, description, basePrice, duration, status } = req.body;

    // Validate required fields
    if (!name || !basePrice) {
      return res.status(400).json({ 
        message: 'Name and base price are required fields' 
      });
    }

    // Check if service with same name exists
    const existingService = await Service.findOne({
      where: { name }
    });

    if (existingService) {
      return res.status(400).json({ message: 'Service with this name already exists' });
    }

    // Create service with validated data
    const service = await Service.create({
      name,
      description,
      basePrice: parseFloat(basePrice), // Ensure basePrice is a number
      duration: duration || 60, // Default to 60 minutes if not provided
      status: status || 'active' // Default to active if not provided
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { name, description, basePrice, duration, status } = req.body;

    // Check for duplicate name if name is being updated
    if (name && name !== service.name) {
      const existingService = await Service.findOne({
        where: { name }
      });

      if (existingService) {
        return res.status(400).json({ message: 'Service with this name already exists' });
      }
    }

    // Update service with validated data
    await service.update({
      name: name || service.name,
      description: description || service.description,
      basePrice: basePrice ? parseFloat(basePrice) : service.basePrice,
      duration: duration || service.duration,
      status: status || service.status
    });

    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.destroy();
    res.json({ message: 'Service removed' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
}; 