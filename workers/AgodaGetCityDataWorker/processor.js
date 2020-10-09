
const _ = require('lodash');
const Async = require('async');
const Moment = require('moment');
const Fs = require('fs');
const Utils = require('../../utils');
const AgodaService = require('../../services/AgodaService');
const agodaService = new AgodaService();
const AgodaGetHotelDataWorker = require('../AgodaGetHotelDataWorker');
const agodaVietnamId = 38;
module.exports = async (job) => {
  try {
    const city = job.data;
    const cityName = Utils.removeVietnameseTones(Utils.removeLocationPrefix(city.title));
    console.log(cityName);
    const citySearch = await agodaService.citySearch({ text: cityName });
    
    const suggestionList = _.get(citySearch, 'SuggestionList', []);
    if (!suggestionList.length) {
      return;
    }
    let suggestionIndex = 0;
    let hasContent = false;
    await Async.whilst(
      (cb) => {
        cb(null, !hasContent && suggestionIndex < suggestionList.length);
      },
      async () => {
        const suggestion = suggestionList[suggestionIndex];
        const cityId = _.get(suggestion, 'ObjectID');
        if (cityId) {
          const next10Day = Moment().add(10, 'days');
          const localCheckIn = next10Day.toISOString().split('T')[0];
          const next11Day = next10Day.add(1, 'day');
          const localCheckOut = next11Day.toISOString().split('T')[0];
          let hotelSearch = await agodaService.hotelSearch({
            cityId,
            localCheckIn,
            localCheckOut,
          });
          const countryId = _.get(hotelSearch, 'data.citySearch.searchResult.searchInfo.objectInfo.countryId');
          if (countryId === agodaVietnamId) {
            // console.log(cityId, _.get(hotelSearch, 'data.citySearch.searchResult.searchInfo.objectInfo'))
            const arrayHotel = _.get(hotelSearch, 'data.citySearch.properties');
            if (arrayHotel) {
              _.forEach(arrayHotel, hotel => AgodaGetHotelDataWorker.addJob({ 
                cityId,
                hotelId: hotel.propertyId,
                localCity: city,
              }));
              hasContent = true;
            }
          }

          if (hasContent) {
            let pageNumber = 2;
            let isLastPage = false;
            await Async.doWhilst(
              async () => {
                hotelSearch = await agodaService.hotelSearch({
                  cityId,
                  localCheckIn,
                  localCheckOut,
                  pageNumber
                });

                const arrayHotel = _.get(hotelSearch, 'data.citySearch.properties');
                if (_.get(arrayHotel, 'length')) {
                  _.forEach(
                    arrayHotel, 
                    hotel => AgodaGetHotelDataWorker.addJob({ 
                      cityId,
                      hotelId: hotel.propertyId,
                      localCity: city,
                    })
                  );
                } else {
                  isLastPage = true;
                }
                pageNumber++;
              },
              async () => !isLastPage
            )
          }
        }
        suggestionIndex++;
      }
    );
  } catch (error) {
    console.log(error);
  }
}