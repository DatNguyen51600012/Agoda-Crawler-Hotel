const _ = require('lodash');
const Async = require('async');
const Moment = require('moment');
const Fs = require('fs');
const Utils = require('../../utils');
const AgodaService = require('../../services/AgodaService');
const HotelModel = require('../../models/HotelModel');
const RoomModel = require('../../models/RoomModel');
const { userInfo } = require('os');
const { Z_MEM_ERROR } = require('zlib');
const agodaService = new AgodaService();
const agodaVietnamId = 38;

module.exports = async (job) => {
  try {
    const { hotelId, agodaHotelId } = job.data;

    const hotelData = await agodaService.hotelDetailSearch({ hotelId: agodaHotelId });
    if (!hotelData.hotelInfo) {
      return;
    }
    console.log(hotelData.aboutHotel.guestPolicies)
    //console.log(hotelData.aboutHotel.starRating.value)
    await HotelModel.updateOne(
      { _id: hotelId },
        {
          awardsAndAccolades: {
            goldCircleAward:{
                year: hotelData.hotelInfo.awardsAndAccolades.goldCircleAward.year,
                awardText: hotelData.hotelInfo.awardsAndAccolades.goldCircleAward.awardText,
                tooltipCmsText: hotelData.hotelInfo.awardsAndAccolades.goldCircleAward.tooltipCmsText,
                isValidGca: hotelData.hotelInfo.awardsAndAccolades.goldCircleAward.isValidGca
            }   
          },

          hotelDesc:{
            overview: hotelData.aboutHotel.hotelDesc.overview,
            hotelFormerName: hotelData.aboutHotel.hotelDesc.hotelFormerName
          },
          otherPolicies: hotelData.aboutHotel.otherPolicies,
        //   hotelPolicy: {
        //     extrabedPolicies: { 
        //       policy: hotelData.aboutHotel.hotelPolicy.extrabedPolicies.policy,               
        //       description: hotelData.aboutHotel.hotelPolicy.extrabedPolicies.description
        //   },
        //  }
          guestPolicies: {
            minimumAgeOfGuest: hotelData.aboutHotel.guestPolicies.minimumAgeOfGuest,
            houseRulesPolicy: hotelData.aboutHotel.guestPolicies.houseRulesPolicy
          },
          hostProfile: {
            displayName: hotelData.aboutHotel.hostProfile.displayName,
            aboutHost: hotelData.aboutHotel.hostProfile.aboutHost,
            location: hotelData.aboutHotel.hostProfile.location,
            photoUrl: hotelData.aboutHotel.hostProfile.photoUrl
          },

          starRating:{
            tooltip: hotelData.hotelInfo.starRating.tooltip,
            value: hotelData.hotelInfo.starRating.value
          }

        });
    //console.log(hotelData.aboutHotel.hotelPolicy.extrabedPolicies[0].description)
    //console.log(hotelData.aboutHotel.hotelPolicy.extrabedPolicies[0].description)
    // const newHotels = _.map(hotelData.aboutHotel.hotelPolicy, (hotels) => {
    //   return { 
          
    //         extrabedPolicies: _.map(hotels.extrabedPolicies, (extrabedPolicies) => ({         
    //             description: extrabedPolicies.description,
    //             policy: extrabedPolicies.policy,
    //         })),
    //         policyNotes: hotels.policyNotes,
         
    //       // userInfoGroup: _.map(hotels.userInfoGroup, (userInfoGroup) => ({
    //       //   id: userInfoGroup.id,
    //       //   name: userInfoGroup.name,
    //       //   items:  _.map(userInfoGroup.items, (items)=> ({
    //       //     id: items.id,
    //       //     title: items.title,
    //       //     description: items.description
    //       //   })) 
    //       // })),
          
          
          
          
      
    //   }      
    // })

    // console.log(newHotels)
    // if (newHotels && newHotels.length) {
    //   await HotelModel.insertMany(newHotels);
    // }
  




    // await RoomModel.updateOne(
    //   { _id: hotelId},
    //     {
    //       isDataReady: hotelData.roomGridData.isDataReady

    //     }

    // );
    
  } catch (error) {
    console.log(error);
  }
}