const Mongoose = require('mongoose');
const AgodaGetCityDataWorker = require('./workers/AgodaGetCityDataWorker');
const AgodaGetHotelDataWorker = require('./workers/AgodaGetHotelDataWorker');
const UpdateHotelDataWorker = require('./workers/UpdateHotelDataWorker');
const AgodaDataCollector = require('./AgodaDataCollector');
const agodaDataCollector = new AgodaDataCollector();
const Utils = require('./utils');
const HotelModel = require('./models/HotelModel')
const RoomModel = require('./models/RoomModel')


process.on('SIGINT', () => {
  process.exit();
});

async function main() {

  // const _limit = 300;
  // let _skip = 0;
  // let hasContent = true;
  // let noRoomCount = 0;
  // do {
  //   const hotels = await HotelModel.find({}).skip(_skip).limit(_limit);
  //   for (const hotel of hotels) {
  //     const rooms = await RoomModel.find({ hotelid: hotel.id });
  //     if (rooms && rooms.length === 1) {
  //       noRoomCount++;
  //       console.log(hotel.id, hotel.name);
  //     }
  //   }
  //   if (hotels.length < _skip) {
  //     hasContent = false;
  //   }
  //   _skip += (hotels.length || 0);
  // } while (hasContent);
  // console.log(noRoomCount);
  AgodaGetCityDataWorker.init();
  AgodaGetHotelDataWorker.init();
  UpdateHotelDataWorker.init();
 // await agodaDataCollector.collectData();
  await agodaDataCollector.updateHotelData();
}
main();