const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Car = sequelize.define('Car', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  licensePlate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  vin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mileage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  timestamps: true
});

module.exports = Car; 