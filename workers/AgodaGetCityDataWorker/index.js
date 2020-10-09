const Queue = require('bull');
const RedisConfig = require('../../config/Redis');
const Path = require('path');

class AgodaGetCityDataWorker {
  
  constructor({ concurrency = 1} = {}) {
    this.agodaVietnamId = 38;
    this.concurrency = concurrency;
    this.processorPath = Path.resolve(__dirname, 'processor.js');
  }
  
  init() {
    this.jobQueue = new Queue('AgodaGetCityData', {
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

module.exports = new AgodaGetCityDataWorker({ concurrency: 25 });