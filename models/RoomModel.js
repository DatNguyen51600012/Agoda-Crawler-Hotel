const Mongoose = require('mongoose');
const Connections = require('./connections');

const RoomInfo =  new Mongoose.Schema({
    id: Number,
    nameRoomType: String,
    maxOccupancy: Number,
    features: [{
        title: String,
        isAvailable: Boolean,
    }],
    amenities: [{
        title: String,
        isAvailable: Boolean, 
    }],
    facilityGroups: [{
        name: String,
        facilities:[{
            title: String,
            symbol: String,
            isAvailable: Boolean,
        }],
    }],
    rooms: [{
        maxFreeChildren: Number,
        roomChildAndExtraBedPolicyViewModel: {
            capacityText: String,
            extraPolicies: [{
                type: String,
            }],
            stayFreeMinAge: Number,
            stayFreeMaxAge: Number,
            childMinAge: Number,
            childMaxAge: Number,
            hasChildrenAndExtraBedPolicies: Boolean,
            isAllowChildren: Boolean,
            withPolicyChildrenStayFree: Boolean
        },
        features: [{            
            title: String,                                              
        }],
        masterId: Number,
        uniqueId: String,
        occupancy: Number,
        adults: Number,
        children: Number,
        extraBeds: Number,
        numberOfGuests: Number,
        occupancyMessage: String,
        availability: Number,
        isBreakfastIncluded: Boolean,
        currency: String,
        pricePopupViewModel: {          
            roomPricePerNightAmount: Number,
            chargePriceAmount: Number,
            taxesAndFeesAmount: Number,
            propertyCrossoutRatePrice: Number,
        },
        inclusivePrice: {
            display: Number,
            crossedOut: Number,
            extraBed: Number,
            couponCrossedOut: Number
        },
        exclusivePrice: {
            display: Number,
            crossedOut: Number,
            extraBed: Number,
            couponCrossedOut: Number
        },
        childRoomInfoDetailViewModel: [{
            description: String,           
        }],
    }],
    images:[{
        type: String,
    }],
    cheapestPrice: Number,        
    beforeDiscountPrice: Number,
    percentageDiscountTextOnImageGallery: String,
    
    hotelid: {
        type: Mongoose.Schema.Types.ObjectId, ref: 'Hotel'
    }
});

module.exports = Connections.agoda.model('Room',RoomInfo,'Room');
