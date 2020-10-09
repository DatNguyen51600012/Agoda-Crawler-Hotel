const Async = require('async');
const _ = require('lodash');
const Moment = require('moment');
const HotelModel = require('./models/HotelModel');
const LocationModel = require('./models/LocationModel');
//const AgodaService = require('./services/AgodaService');
//const agodaService = new AgodaService();
const AgodaGetCityDataWorker = require('./workers/AgodaGetCityDataWorker');
const AgodaGetHotelDataWorker = require('./workers/AgodaGetHotelDataWorker');
const UpdateHotelDataWorker = require('./workers/UpdateHotelDataWorker');

class AgodaDataCollector {

  constructor() {
    this.agodaVietnamId = 38;
  }

  async collectData() {
    const _limit = 100;
    const cities = await LocationModel.find({ parentIdentifyCode: 'root' }).limit(_limit);
    // //console.log(cities)
    _.forEach(cities, city => AgodaGetCityDataWorker.addJob(city));
  /*  return AgodaGetHotelDataWorker.addJob({
      hotelId: 12028171,
      cityId: 12028171,
    })
  */    
  }

  async updateHotelData() {
    const _limit = 200;
    let _skip = 0;
    let hasContent = true;

    await Async.doWhilst(
      async () => {
        const hotels = await HotelModel.find({}).limit(_limit).skip(_skip);
        if (!hotels || !hotels.length) {
          hasContent = false;
          return;
        }

        _skip += hotels.length;
        if (hotels.length < _limit) {
          hasContent = false;
        } 

        _.forEach(hotels, (hotel) => {
          UpdateHotelDataWorker.addJob({ hotelId: hotel.id, agodaHotelId: hotel.agodaHotelId });
        })
        
      },
      async () => hasContent
    )

    console.log('skip', _skip);
  }

}

module.exports = AgodaDataCollector;
