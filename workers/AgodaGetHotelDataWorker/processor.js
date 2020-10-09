const Fs = require('fs');
const _ = require('lodash');
const AgodaService = require('../../services/AgodaService');
const agodaService = new AgodaService();
const HotelModel = require('../../models/HotelModel');
const { Console } = require('console');
const LocationModel = require('../../models/LocationModel');
const RoomModel = require('../../models/RoomModel');

module.exports = async (job) => { 
  try {
  
    const { 
      hotelId: agodaHotelId,
      cityId: agodaCityId,
      localCity = {}
    } = job.data;
    const hotelData = await agodaService.hotelDetailSearch({ hotelId: agodaHotelId });
    // if (!hotelData.hotelInfo) {
    //   return;
    // }
    
    const newHotel = await HotelModel.create({
      agodaHotelId,
      agodaCityId,
      name: hotelData.hotelInfo.name,
      englishName: hotelData.hotelInfo.englishName,
      accommodationType: hotelData.hotelInfo.accommodationType,
      locationHighlightMessage: hotelData.hotelInfo.locationHighlightMessage,
      localLocationId: localCity.id,
      localLocationCode: localCity.identifyCode,
      
      // engagement: {
      //   todayBooking: hotelData.hotelInfo.engagement.todayBooking,
      //   hasBookingHistory: hotelData.hotelInfo.engagement.hasBookingHistory
      // },
      // awardsAndAccolades:{
      //   goldCircleAward: {
      //     year: hotelData.hotelId.awardsAndAccolades.goldCircleAward.year,
      //     awardText: hotelData.hotelId.awardsAndAccolades.goldCircleAward.awardText,
      //     tooltipCmsText: hotelData.hotelId.awardsAndAccolades.goldCircleAward.tooltipCmsText,
      //     isValidGca: hotelData.hotelId.awardsAndAccolades.goldCircleAward.isValidGca
      //   }
      // },
      // address:{
      //   countryId: hotelData.hotelInfo.address.countryId,
      //   full: hotelData.hotelInfo.address.full,
      //   cityName: hotelData.hotelInfo.address.cityName,
      //   cityId: hotelData.hotelInfo.address.cityId,
      //   countryName: hotelData.hotelInfo.address.countryName,
      //   areaName: hotelData.hotelInfo.address.areaName,
      //   address: hotelData.hotelInfo.address.address,
      //   postalCode: hotelData.hotelInfo.address.postalCode
      // },
      // images: [{
      //   id: hotelData.mosaicInitData.images.id,
      //   title: hotelData.mosaicInitData.images.title,
      //   location: hotelData.mosaicInitData.images.location
      // }],
      // mapParams: {            
      //   staticUrl: hotelData.mapParams.staticUrl,
      //   url: hotelData.mapParams.url,            
      //   latlng: hotelData.mapParams.latlng
      // },
      // starRating: {
      //   tooltip: hotelData.hotelInfo.starRating, 
      //   value: hotelData.hotelInfo.value  
      // },

      
      
      

      /*location: hotelData.mosaicInitData.images.location,
      locationMediumRectangle: hotelData.mosaicInitData.images.locationMediumRectangle,
      locationWithWideSize: hotelData.mosaicInitData.images.locationWithWideSize,
      locationWithSquareSize: hotelData.mosaicInitData.images.locationWithSquareSize,
      locationWithSquareSize2X: hotelData.mosaicInitData.images.locationWithSquareSize2X,
      mapOpenTrackUrl: hotelData.mosaicInitData.mapOpenTrackUrl,
      staticMapUrl: hotelData.mosaicInitData.staticMapUrl,*/

    });
    

    /*const newRoom = await new RoomModel.create({
      
      name:  'ds',
    

    }).*/
   
    
    // const hotels = _.map(hotelData.aboutHotel, (hotel) => {
    //   return {
       
    //       hotelDesc: {
    //           overview: hotel.hotelDesc.overview,
    //           hotelFormerName: hotel.hotelDesc.hotelFormerName,                
    //       },
    //       hotelPolicy: {
    //         extrabedPolicies: _.map(hotel.hotelPolicy.extrabedPolicies, (extrabedPolicies) =>({
    //             description: extrabedPolicies.description,
    //         })),                
    //         guestPolicies: {
    //                   minimumAgeOfGuest: hotel.hotelPolicy.guestPolicies.minimumAgeOfGuest,
    //                   houseRulesPolicy:  hotel.hotelPolicy.guestPolicies.houseRulesPolicy,
    //         },
    //         otherPolicies: hotel.otherPolicies,
    //         placesOfInterest: {
    //                   placesOfInterestProperties: _.map(hotel.placesOfInterest.placesOfInterestProperties, (placesOfInterestProperties)=>({                     
    //                         categoryName: placesOfInterestProperties.categoryName,
    //                         places: _.map(placesOfInterestProperties.places, (places) => ({ 
    //                             name: places.name,                                        
    //                             picturePath: places.picturePath,                    
    //                             distanceFormattedString: places.distanceFormattedString,
    //                             landmarkTypeName: places.landmarkTypeName, 
    //                         }))                   
    //                   })),  
    //                   header: String,
    //         },
    //         hostProfile: {
    //                  displayName: hotel.hostProfile,                
    //                  aboutHost: hotel.aboutHost,                
    //                  location: hotel.location,                
    //                  photoUrl: hotel.photoUrl,               
    //         },
    //       }
    //     }
    // });
    // if (hotels && hotels.length) {
    //   await HotelModel.insertMany(hotels);
    // } 
            

    
    const newRooms = _.map(hotelData.roomGridData.masterRooms, (room) => {
      return { 
        hotelid: newHotel.id,
        nameRoomType: room.name,
        maxOccupancy: room.maxOccupancy,
        features: _.map(room.features, features => ({            
            title: features.title
        })),
        amenities: _.map(room.amenities, amenity => ({
          title: amenity.title,
          isAvailable: amenity.isAvailable,
        })) ,
        facilityGroups: _.map(room.facilityGroups, facilityGroup => ({
          name: facilityGroup.name,
          facilities: _.map (facilityGroup.facilities, facilities => ({
            title: facilities.title,
            isAvailable: facilities.isAvailable 
          })),
        })),
        rooms: _.map(room.rooms, (rooms) => ({
          maxFreeChildren: rooms.maxFreeChildren,
          roomChildAndExtraBedPolicyViewModel: {
              capacityText: rooms.roomChildAndExtraBedPolicyViewModel.capacityText,
              extraPolicies: rooms.roomChildAndExtraBedPolicyViewModel.extraPolicies,
              stayFreeMinAge: rooms.roomChildAndExtraBedPolicyViewModel.stayFreeMinAge,
              stayFreeMaxAge: rooms.roomChildAndExtraBedPolicyViewModel.stayFreeMaxAge,
              childMinAge: rooms.roomChildAndExtraBedPolicyViewModel.childMinAge,
              childMaxAge: rooms.roomChildAndExtraBedPolicyViewModel.childMaxAge,
              hasChildrenAndExtraBedPolicies: rooms.roomChildAndExtraBedPolicyViewModel.hasChildrenAndExtraBedPolicies,
              isAllowChildren: rooms.roomChildAndExtraBedPolicyViewModel.isAllowChildren,
              withPolicyChildrenStayFree: rooms.roomChildAndExtraBedPolicyViewModel.withPolicyChildrenStayFree,
          },
          features: rooms.features,
          masterId: rooms.masterId,
          uniqueId: rooms.uniqueId,
          occupancy: rooms.occupancy,
          adults: rooms.adults,
          children: rooms.children,
          extraBeds: rooms.extraBeds,
          numberOfGuests: rooms.numberOfGuests,
          occupancyMessage: rooms.occupancyMessage,
          availability: rooms.availability,
          isBreakfastIncluded: rooms.isBreakfastIncluded,
          currency: rooms.currency,
          pricePopupViewModel: {          
              roomPricePerNightAmount: rooms.pricePopupViewModel.roomPricePerNightAmount,
              chargePriceAmount: rooms.pricePopupViewModel.chargePriceAmount,
              taxesAndFeesAmount: rooms.pricePopupViewModel.taxesAndFeesAmount,
              propertyCrossoutRatePrice: rooms.pricePopupViewModel.propertyCrossoutRatePrice,
          },
          childRoomInfoDetailViewModel: rooms.pricePopupViewModel.childRoomInfoDetailViewModel,

        })),

        images: room.images,


        cheapestPrice: room.cheapestPrice,        
        beforeDiscountPrice: room.beforeDiscountPrice,
        percentageDiscountTextOnImageGallery: room.percentageDiscountTextOnImageGallery,

      }
    });
    


    if (newRooms && newRooms.length) {
      await RoomModel.insertMany(newRooms);
    }


  } catch (error) {
   // console.log(error);
  }


};


