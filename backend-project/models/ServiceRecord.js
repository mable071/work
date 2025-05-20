const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Car = require('./Car');
const Service = require('./Service');

const ServiceRecord = sequelize.define('ServiceRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  carId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Car,
      key: 'id'
    }
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Service,
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  technician: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Define associations
ServiceRecord.belongsTo(Car, { foreignKey: 'carId' });
ServiceRecord.belongsTo(Service, { foreignKey: 'serviceId' });

// Create PartsUsed model for the many-to-many relationship
const PartsUsed = sequelize.define('PartsUsed', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  serviceRecordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ServiceRecord,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
});

ServiceRecord.hasMany(PartsUsed, { foreignKey: 'serviceRecordId' });
PartsUsed.belongsTo(ServiceRecord, { foreignKey: 'serviceRecordId' });

module.exports = { ServiceRecord, PartsUsed }; 