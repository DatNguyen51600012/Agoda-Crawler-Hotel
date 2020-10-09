const Mongoose = require('mongoose');
const Connections = require('./connections');

const LocationSchema = new Mongoose.Schema({
  id: Number,
  title: String,
  identifyCode: String,
  parentIdentifyCode: String,
  path: String,

}, { timestamps: true });

module.exports = Connections.payme.model('Location', LocationSchema, 'Location');
