const Async = require('async');
const Queue = require('bull');
const _ = require('lodash');
const Path = require('path');
const Moment = require('moment');
const RedisConfig = require('../../config/Redis');
const AgodaService = require('../../services/AgodaService');
const agodaService = new AgodaService();

class AgodaGetHotelDataWorker {
  
  constructor({ concurrency = 1} = {}) {
    this.concurrency = concurrency;
    this.agodaVietnamId = 38;
    this.processorPath = Path.resolve(__dirname, 'processor.js');
  }
  init() {
    this.jobQueue = new Queue('AgodaGetHotelData', {
      redis: RedisConfig,
    });
    //return this.jobQueue.process(this.concurrency, this.processorPath);
    return this.jobQueue.process(this.concurrency, require('./processor'));
  }
  async addJob(data) {
    return this.jobQueue && this.jobQueue.add(data, {
      removeOnComplete: true,
    });
  }

}

module.exports = new AgodaGetHotelDataWorker({ concurrency: 50 });