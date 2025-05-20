const User = require('./User');
const Car = require('./Car');
const Service = require('./Service');
const { ServiceRecord, PartsUsed } = require('./ServiceRecord');
const Payment = require('./Payment');

// Define associations
ServiceRecord.belongsTo(Car, { foreignKey: 'carId' });
ServiceRecord.belongsTo(Service, { foreignKey: 'serviceId' });
ServiceRecord.hasMany(PartsUsed, { foreignKey: 'serviceRecordId' });
PartsUsed.belongsTo(ServiceRecord, { foreignKey: 'serviceRecordId' });

Payment.belongsTo(ServiceRecord, { foreignKey: 'serviceRecordId' });
ServiceRecord.hasMany(Payment, { foreignKey: 'serviceRecordId' });

module.exports = {
  User,
  Car,
  Service,
  ServiceRecord,
  Payment,
  PartsUsed
}; 