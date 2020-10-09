const Mongoose = require('mongoose');
const Connections = require('./connections');


const HotelInfo =  new Mongoose.Schema({
        agodaHotelId: {
            type: Number,           
        },
        agodaCityId: {
            type: Number,           
        },
        name: {
            type: String,            
        },
        englishName: {
            type: String,          
        },        
        hotelDesc: {
            overview: String,
            hotelFormerName: String,                
        },
        hotelPolicy: {
            extrabedPolicies: [{ 
                policy: String,               
                description: String,
            }],
            policyNotes: [{
              type: String   
            }]
        },
        guestPolicies: {
            minimumAgeOfGuest: String,
            houseRulesPolicy:  String,
        },
        otherPolicies: [{
                type: String
        }],
        usefulInfoGroups: [{
            id: Number,
            name: String,
            items: [{
                id: Number,
                title: String, // Check in check out untill 
                description: String,                
            },]
        }],
        placesOfInterest: {
            placesOfInterestProperties: [{
                categoryName: String,
                places: [{
                    name: String,                                        
                    picturePath: String,                    
                    distanceFormattedString: String,
                    landmarkTypeName: String, 
                }],                   
            }],
            header: String,
        },            
        hostProfile: {
                displayName: String,                
                aboutHost: String,                
                location: String,                
                photoUrl: String,               
        },
        accommodationType: {
            type: String,          
        },
        locationHighlightMessage: {
            type: String,           
        },
        localLocationId: {
            type: Number,
        },
        localLocationCode: {    
            type: String,      
        },
        engagement: {       
            todayBooking: String,   
            hasBookingHistory: String,              
        },
        mapParams: {            
            staticUrl: String,
            url: String,            
            latlng: [{
                type: Number
            }],
        },
        starRating: {
            tooltip: String,            
            value: Number
        },        
        awardsAndAccolades: {
            goldCircleAward:{
                year: String,
                awardText: String,
                tooltipCmsText: String,
                isValidGca: Boolean
            }   
        },
        address: {
            countryId: {
                type: Number,              
            },
            full: {
                type: String,                
            },
            cityName: {
                type: String,                
            },
            cityId: {
                type: Number,                
            },
            countryName: {
                type: String,                
            },
            areaName: {
                type: String,               
            },
            address: {
                type: String,               
            },
            postalCode: {
                type: String,
            },
        },
        images: {
            id: {
                type: String,
                require: true
            },
            title: {
                type: String,
                require: true
            },
            location: {
                type: String,
                require: true
            },           
        },
    },{versionKey: false,}); 
    //    mapOpenTrackUrl:  {
    //        type: String,
    //        require: true
    //    },
    //    staticMapUrl:  {
    //        type: String,
    //        require: true
    //    },
    

module.exports = Connections.agoda.model('Hotel',HotelInfo,'Hotel');
