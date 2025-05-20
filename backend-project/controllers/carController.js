const { Car } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Private
const getCars = async (req, res) => {
  try {
    const cars = await Car.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(cars);
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get car by ID
// @route   GET /api/cars/:id
// @access  Private
const getCarById = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.json(car);
  } catch (error) {
    console.error('Get car by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private
const createCar = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      licensePlate,
      vin,
      color,
      mileage,
      status
    } = req.body;

    // Validate required fields
    if (!make || !model || !year || !licensePlate || !vin) {
      return res.status(400).json({
        message: 'Make, model, year, license plate, and VIN are required fields'
      });
    }

    // Check if car with same VIN or license plate exists
    const existingCar = await Car.findOne({
      where: {
        [Op.or]: [
          { vin: vin },
          { licensePlate: licensePlate }
        ]
      }
    });

    if (existingCar) {
      return res.status(400).json({
        message: 'Car with this VIN or license plate already exists'
      });
    }

    // Create car with validated data
    const car = await Car.create({
      make,
      model,
      year: parseInt(year),
      licensePlate,
      vin,
      color: color || null,
      mileage: mileage ? parseInt(mileage) : 0,
      status: status || 'active'
    });

    res.status(201).json(car);
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const {
      make,
      model,
      year,
      licensePlate,
      vin,
      color,
      mileage,
      status
    } = req.body;

    // Check for duplicate VIN or license plate if being updated
    if ((vin && vin !== car.vin) || (licensePlate && licensePlate !== car.licensePlate)) {
      const existingCar = await Car.findOne({
        where: {
          [Op.or]: [
            { vin: vin || car.vin },
            { licensePlate: licensePlate || car.licensePlate }
          ],
          id: { [Op.ne]: car.id }
        }
      });

      if (existingCar) {
        return res.status(400).json({
          message: 'Car with this VIN or license plate already exists'
        });
      }
    }

    // Update car with validated data
    await car.update({
      make: make || car.make,
      model: model || car.model,
      year: year ? parseInt(year) : car.year,
      licensePlate: licensePlate || car.licensePlate,
      vin: vin || car.vin,
      color: color || car.color,
      mileage: mileage ? parseInt(mileage) : car.mileage,
      status: status || car.status
    });

    res.json(car);
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    await car.destroy();
    res.json({ message: 'Car removed' });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
}; 