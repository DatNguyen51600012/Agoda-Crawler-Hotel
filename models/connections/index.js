const MongooseConfigs = require('../../config/Mongoose');
const Mongoose = require('mongoose');

module.exports = {
  agoda: Mongoose.createConnection(MongooseConfigs.agoda.uri, MongooseConfigs.agoda.options),
  payme: Mongoose.createConnection(MongooseConfigs.payme.uri, MongooseConfigs.payme.options),
}