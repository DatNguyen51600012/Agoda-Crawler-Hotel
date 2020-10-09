const Fetch = require('node-fetch');
const Moment = require('moment');
const _ = require('lodash');
const UrlEncode = require('urlencode');
const axios = require('axios').default;


class AgodaService {

  constructor({ url = 'https://www.agoda.com/' } = {}) {
    this.url = url;
    this.searchUrl = this.url + '/graphql/search';
    this.citySearchUrl = this.url + '/Search/Search/GetUnifiedSuggestResult/3/1/1/0/en-us';
    this.hotelDetailUrl = this.url + '/api/en-us/pageparams/property';

  }
  
    async hotelDetailSearch({
      hotelId
    }) {
        const queries = `finalPriceView=0&isShowMobileAppPrice=false&cid=-1&numberOfBedrooms=&familyMode=true&isAgMse=false&ccallout=false&defdate=false&adults=2&children=0&rooms=1&maxRooms=9&checkIn=2020-11-30&childAges=&defaultChildAge=8&travellerType=1&tspTypes=15&los=31&searchrequestid=1a60c0a7-a98c-44a5-8dd2-cbaab6c9f238&hotel_id=${hotelId}&all=false`
        try {
            const requestUrl = `${this.hotelDetailUrl}?${queries}`;
            let res = await axios.get(`${this.hotelDetailUrl}?${queries}`);
            return res.data;
            
        } catch (error) {
            return {
                error: error.message
            }
        }
        
    }
    

  async citySearch({
    text = ''
  } = {}) {
    const queries = `?searchText=${UrlEncode(text)}&origin=VN&isHotelLandSearch=true`;
    const url = this.citySearchUrl + queries;
    const headers = {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json; charset=utf-8",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    };

    try {
      const data = await Fetch(url, {
        "headers": headers,
        "referrerPolicy": "origin-when-cross-origin",
        //"body": null,
        "method": "GET",
        "mode": "cors"
      }).then(res => res.json());

      return data;
    } catch (error) {
        console.log(error);
      return {
        error: error.message
      }
    }
  }

  async hotelSearch({ 
    cityId, 
    localCheckIn, 
    localCheckOut,
    pageSize = 100,
    pageNumber = 1,
  } = {}) {
    
    const headers = {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "access-control-max-age": "7200",
      "ag-debug-override-origin": "VN",
      "ag-language-locale": "en-US",
      "content-type": "application/json",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    };
    const body = Private.getSearchBody({ cityId, localCheckIn, localCheckOut, pageSize, pageNumber });
    
    try {
      const data = await Fetch(this.searchUrl, {
        headers,
        body: JSON.stringify(body),
        method: 'POST',
        mode: 'cors'
      }).then(res => res.json());
      
      return data;
    } catch(error) {
      return {
        error: error.message
      }
    }
  }
}

const Private = {
  getSearchBody({ 
    cityId, 
    localCheckIn, 
    localCheckOut,
    pageSize = 100,
    pageNumber = 1,
  } = {}) {
    const checkOutMoment = Moment(localCheckOut);
    const checkInMoment = Moment(localCheckIn);

    const bookingDate = Moment().toISOString();
    const checkIn = checkInMoment.toISOString();
    const checkOut = checkOutMoment.toISOString();

    const losDuration = Moment.duration(checkOutMoment.diff(checkInMoment));
    const los = losDuration.asDays();
    return { // body template, copy from browser
      "operationName": "citySearch",
      "variables": {
          "CitySearchRequest": {
              "cityId": cityId,
              "searchRequest": {
                  "searchCriteria": {
                      "localCheckInDate": localCheckIn,
                      "los": los,
                      "rooms": 0,
                      "adults": 0,
                      "children": 0,
                      "childAges": [],
                      "ratePlans": [],
                      "featureFlagRequest": {
                          "fetchNamesForTealium": true,
                          "fiveStarDealOfTheDay": true,
                          "isAllowBookOnRequest": false,
                          "showUnAvailable": true,
                          "showRemainingProperties": true,
                          "flags": [
                              {
                                  "feature": "FamilyChildFriendlyPopularFilter",
                                  "enable": true
                              },
                              {
                                  "feature": "FamilyChildFriendlyPropertyTypeFilter",
                                  "enable": true
                              },
                              {
                                  "feature": "FamilyMode",
                                  "enable": false
                              },
                              {
                                  "feature": "ReturnHotelNotReadyIfPullNotReady",
                                  "enable": false
                              }
                          ]
                      },
                      "isUserLoggedIn": false,
                      "currency": "VND",
                      "travellerType": "Couple",
                      "isAPSPeek": false,
                      "enableOpaqueChannel": false,
                      "isEnabledPartnerChannelSelection": null,
                      "sorting": {
                          "sortField": "Ranking",
                          "sortOrder": "Desc",
                          "sortParams": null
                      },
                      "requiredBasis": "PRPN",
                      "requiredPrice": "Exclusive",
                      "suggestionLimit": 0,
                      "synchronous": false,
                      "supplierPullMetadataRequest": null,
                      "isRoomSuggestionRequested": false,
                      "isAPORequest": false,
                      "hasAPOFilter": false,
                      "isAllowBookOnRequest": true
                  },
                  "searchContext": {
                      "userId": "ec4cb602-fea3-410f-85c7-579773206929",
                      "memberId": 0,
                      "locale": "en-us",
                      "cid": -1,
                      "origin": "VN",
                      "platform": 1,
                      "deviceTypeId": 1,
                      "experiments": {
                          "forceByVariant": null,
                          "forceByExperiment": [
                              {
                                  "id": "FAM-366",
                                  "variant": "B"
                              },
                              {
                                  "id": "CP-4081",
                                  "variant": "B"
                              },
                              {
                                  "id": "DRAGON-2308",
                                  "variant": "B"
                              },
                              {
                                  "id": "MIN-13903-2",
                                  "variant": "B"
                              },
                              {
                                  "id": "MIN-14036",
                                  "variant": "B"
                              },
                              {
                                  "id": "PLECS-5778",
                                  "variant": "Z"
                              },
                              {
                                  "id": "PACKAGES-373",
                                  "variant": "B"
                              },
                              {
                                  "id": "TEXT-9339",
                                  "variant": "Z"
                              },
                              {
                                  "id": "PACKAGES-426",
                                  "variant": "B"
                              },
                              {
                                  "id": "TEXT-9953",
                                  "variant": "B"
                              },
                              {
                                  "id": "PAPIIN-896",
                                  "variant": "B"
                              },
                              {
                                  "id": "SEARCH-7365",
                                  "variant": "B"
                              }
                          ]
                      },
                      "isRetry": false,
                      "showCMS": false,
                      "storeFrontId": 3,
                      "pageTypeId": 103,
                      "whiteLabelKey": null,
                      "ipAddress": "113.161.93.54",
                      "endpointSearchType": "CitySearch",
                      "trackSteps": null
                  },
                  "matrix": null,
                  "matrixGroup": [
                      {
                          "matrixGroup": "AffordableCategory",
                          "size": 100
                      },
                      {
                          "matrixGroup": "HotelFacilities",
                          "size": 100
                      },
                      {
                          "matrixGroup": "BeachAccessTypeIds",
                          "size": 100
                      },
                      {
                          "matrixGroup": "StarRating",
                          "size": 20
                      },
                      {
                          "matrixGroup": "NumberOfBedrooms",
                          "size": 100
                      },
                      {
                          "matrixGroup": "LandmarkIds",
                          "size": 10
                      },
                      {
                          "matrixGroup": "AllGuestReviewBreakdown",
                          "size": 100
                      },
                      {
                          "matrixGroup": "MetroSubwayStationLandmarkIds",
                          "size": 20
                      },
                      {
                          "matrixGroup": "ProductType",
                          "size": 100
                      },
                      {
                          "matrixGroup": "BusStationLandmarkIds",
                          "size": 20
                      },
                      {
                          "matrixGroup": "RoomBenefits",
                          "size": 100
                      },
                      {
                          "matrixGroup": "ReviewLocationScore",
                          "size": 3
                      },
                      {
                          "matrixGroup": "LandmarkSubTypeCategoryIds",
                          "size": 20
                      },
                      {
                          "matrixGroup": "ReviewScore",
                          "size": 100
                      },
                      {
                          "matrixGroup": "IsStaycation",
                          "size": 5
                      },
                      {
                          "matrixGroup": "AccommodationType",
                          "size": 100
                      },
                      {
                          "matrixGroup": "PaymentOptions",
                          "size": 100
                      },
                      {
                          "matrixGroup": "TrainStationLandmarkIds",
                          "size": 20
                      },
                      {
                          "matrixGroup": "HotelAreaId",
                          "size": 100
                      },
                      {
                          "matrixGroup": "HotelChainId",
                          "size": 10
                      },
                      {
                          "matrixGroup": "AtmosphereIds",
                          "size": 100
                      },
                      {
                          "matrixGroup": "RoomAmenities",
                          "size": 100
                      },
                      {
                          "matrixGroup": "Deals",
                          "size": 100
                      }
                  ],
                  "filterRequest": {
                      "idsFilters": [],
                      "rangeFilters": [],
                      "textFilters": []
                  },
                  "page": {
                      "pageSize": pageSize,
                      "pageNumber": pageNumber
                  },
                  "apoRequest": {
                      "apoPageSize": 10
                  },
                  "searchHistory": [
                      // {
                      //     "objectId": 1576565,
                      //     "searchDate": "2020-9-25",
                      //     "searchType": "PropertySearch",
                      //     "childrenAges": []
                      // }
                  ],
                  "searchDetailRequest": {
                      "priceHistogramBins": 50
                  },
                  "isTrimmedResponseRequested": false,
                  "featuredAgodaHomesRequest": null,
                  "highlyRatedAgodaHomesRequest": {
                      "numberOfAgodaHomes": 30,
                      "minimumReviewScore": 7.5,
                      "minimumReviewCount": 3,
                      "accommodationTypes": [
                          28,
                          29,
                          103,
                          131
                      ],
                      "sortVersion": 0
                  },
                  "extraAgodaHomesRequest": null,
                  "extraHotels": {
                      "extraHotelIds": [],
                      "enableFiltersForExtraHotels": false
                  },
                  "packaging": null
              }
          },
          "ContentSummaryRequest": {
              "context": {
                  "rawUserId": "ec4cb602-fea3-410f-85c7-579773206929",
                  "memberId": 0,
                  "userOrigin": "VN",
                  "locale": "en-us",
                  "forceExperimentsByIdNew": [
                      {
                          "key": "FAM-366",
                          "value": "B"
                      },
                      {
                          "key": "CP-4081",
                          "value": "B"
                      },
                      {
                          "key": "DRAGON-2308",
                          "value": "B"
                      },
                      {
                          "key": "MIN-13903-2",
                          "value": "B"
                      },
                      {
                          "key": "MIN-14036",
                          "value": "B"
                      },
                      {
                          "key": "PLECS-5778",
                          "value": "Z"
                      },
                      {
                          "key": "PACKAGES-373",
                          "value": "B"
                      },
                      {
                          "key": "TEXT-9339",
                          "value": "Z"
                      },
                      {
                          "key": "PACKAGES-426",
                          "value": "B"
                      },
                      {
                          "key": "TEXT-9953",
                          "value": "B"
                      },
                      {
                          "key": "PAPIIN-896",
                          "value": "B"
                      },
                      {
                          "key": "SEARCH-7365",
                          "value": "B"
                      }
                  ],
                  "apo": false,
                  "searchCriteria": {
                      "cityId": 17242
                  },
                  "platform": {
                      "id": 1
                  },
                  "storeFrontId": 3,
                  "cid": "-1",
                  "occupancy": {
                      "numberOfAdults": 2,
                      "numberOfChildren": 0,
                      "travelerType": 1
                  },
                  "deviceTypeId": 1,
                  "whiteLabelKey": "",
                  "correlationId": ""
              },
              "summary": {
                  "highlightedFeaturesOrderPriority": null,
                  "description": false
              },
              "reviews": {
                  "commentary": null,
                  "demographics": {
                      "providerIds": null,
                      "filter": {
                          "defaultProviderOnly": true
                      }
                  },
                  "summaries": {
                      "providerIds": null,
                      "apo": true,
                      "limit": 1,
                      "travellerType": 2
                  },
                  "cumulative": {
                      "providerIds": null
                  },
                  "filters": null
              },
              "images": {
                  "page": null,
                  "maxWidth": 0,
                  "maxHeight": 0,
                  "imageSizes": null,
                  "indexOffset": null
              },
              "rooms": {
                  "images": null,
                  "featureLimit": 0,
                  "filterCriteria": null,
                  "includeMissing": false,
                  "includeSoldOut": false,
                  "includeDmcRoomId": false,
                  "soldOutRoomCriteria": null
              },
              "nonHotelAccommodation": true,
              "engagement": true,
              "highlights": {
                  "maxNumberOfItems": 0,
                  "images": {
                      "imageSizes": [
                          {
                              "key": "full",
                              "size": {
                                  "width": 0,
                                  "height": 0
                              }
                          }
                      ]
                  }
              },
              "personalizedInformation": false,
              "localInformation": {
                  "images": null
              },
              "features": null,
              "synopsis": true
          },
          "PricingSummaryRequest": {
              "cheapestOnly": false,
              "context": {
                  "abTests": [
                      {
                          "testId": 9021,
                          "abUser": "B"
                      },
                      {
                          "testId": 9023,
                          "abUser": "B"
                      },
                      {
                          "testId": 9024,
                          "abUser": "B"
                      },
                      {
                          "testId": 9025,
                          "abUser": "B"
                      },
                      {
                          "testId": 9027,
                          "abUser": "B"
                      },
                      {
                          "testId": 9029,
                          "abUser": "B"
                      }
                  ],
                  "clientInfo": {
                      "cid": -1,
                      "languageId": 1,
                      "languageUse": 1,
                      "origin": "VN",
                      "platform": 1,
                      "searchId": "",
                      "storefront": 3,
                      "userId": "ec4cb602-fea3-410f-85c7-579773206929",
                      "ipAddress": "113.161.93.54"
                  },
                  "experiment": [
                      {
                          "name": "FAM-366",
                          "variant": "B"
                      },
                      {
                          "name": "CP-4081",
                          "variant": "B"
                      },
                      {
                          "name": "DRAGON-2308",
                          "variant": "B"
                      },
                      {
                          "name": "MIN-13903-2",
                          "variant": "B"
                      },
                      {
                          "name": "MIN-14036",
                          "variant": "B"
                      },
                      {
                          "name": "PLECS-5778",
                          "variant": "Z"
                      },
                      {
                          "name": "PACKAGES-373",
                          "variant": "B"
                      },
                      {
                          "name": "TEXT-9339",
                          "variant": "Z"
                      },
                      {
                          "name": "PACKAGES-426",
                          "variant": "B"
                      },
                      {
                          "name": "TEXT-9953",
                          "variant": "B"
                      },
                      {
                          "name": "PAPIIN-896",
                          "variant": "B"
                      },
                      {
                          "name": "SEARCH-7365",
                          "variant": "B"
                      }
                  ],
                  "isAllowBookOnRequest": true,
                  "isDebug": false,
                  "sessionInfo": {
                      "isLogin": false,
                      "memberId": 0,
                      "sessionId": 1
                  },
                  "packaging": null
              },
              "isSSR": true,
              "pricing": {
                  "bookingDate": bookingDate,
                  "checkIn": checkIn,
                  "checkout": checkOut,
                  "localCheckInDate": localCheckIn,
                  "localCheckoutDate": localCheckOut,
                  "currency": "VND",
                  "details": {
                      "cheapestPriceOnly": false,
                      "itemBreakdown": false,
                      "priceBreakdown": false
                  },
                  "featureFlag": [
                      "ClientDiscount",
                      "PriceHistory",
                      "VipPlatinum",
                      "CouponSellEx",
                      "MixAndSave",
                      "APSPeek",
                      "StackChannelDiscount",
                      "AutoApplyPromos"
                  ],
                  "features": {
                      "crossOutRate": false,
                      "isAPSPeek": false,
                      "isAllOcc": false,
                      "isApsEnabled": false,
                      "isIncludeUsdAndLocalCurrency": false,
                      "isMSE": true,
                      "isRPM2Included": true,
                      "maxSuggestions": 0,
                      "newRateModel": false,
                      "overrideOccupancy": false,
                      "priusId": 0,
                      "synchronous": false
                  },
                  "filters": {
                      "cheapestRoomFilters": [],
                      "filterAPO": false,
                      "ratePlans": [
                          1
                      ],
                      "secretDealOnly": false,
                      "suppliers": [],
                      "nosOfBedrooms": []
                  },
                  "includedPriceInfo": false,
                  "occupancy": {
                      "adults": 2,
                      "children": 0,
                      "childAges": [],
                      "rooms": 1
                  },
                  "supplierPullMetadata": {
                      "requiredPrecheckAccuracyLevel": 0
                  },
                  "mseHotelIds": [],
                  "ppLandingHotelIds": [],
                  "searchedHotelIds": [],
                  "paymentId": -1
              },
              "suggestedPrice": "Exclusive"
          }
      },
      "query": "query citySearch($CitySearchRequest: CitySearchRequest!, $ContentSummaryRequest: ContentSummaryRequest!, $PricingSummaryRequest: PricingRequestParameters) {  citySearch(CitySearchRequest: $CitySearchRequest) {    searchResult {      sortMatrix {        result {          fieldId          sorting {            sortField            sortOrder            sortParams {              id            }          }          display {            name          }          childMatrix {            fieldId            sorting {              sortField              sortOrder              sortParams {                id              }            }            display {              name            }            childMatrix {              fieldId              sorting {                sortField                sortOrder                sortParams {                  id                }              }              display {                name              }            }          }        }      }      searchInfo {        hasSecretDeal        isComplete        totalFilteredHotels        searchStatus {          searchCriteria {            checkIn          }          searchStatus        }        objectInfo {          objectName          cityName          cityEnglishName          countryId          countryEnglishName          mapLatitude          mapLongitude          mapZoomLevel          wlPreferredCityName          wlPreferredCountryName        }      }      urgencyDetail {        urgencyScore      }      histogram {        bins {          numOfElements          upperBound {            perNightPerRoom            perPax          }        }      }    }    properties(ContentSummaryRequest: $ContentSummaryRequest, PricingSummaryRequest: $PricingSummaryRequest) {      propertyId      sponsoredDetail {        sponsoredType        trackingData        isShowSponsoredFlag      }      propertyResultType      content {        informationSummary {          propertyLinks {            propertyPage          }          atmospheres {            id            name          }          localeName          defaultName          displayName          accommodationType          awardYear          hasHostExperience          address {            country {              id              name            }            city {              id              name            }            area {              id              name            }          }          propertyType          rating          agodaGuaranteeProgram          remarks {            renovationInfo {              renovationType              year            }          }          spokenLanguages {            id          }          geoInfo {            latitude            longitude          }        }        propertyEngagement {          lastBooking          peopleLooking        }        nonHotelAccommodation {          masterRooms {            noOfBathrooms            noOfBedrooms            noOfBeds            roomSizeSqm            highlightedFacilities          }          hostLevel {            id            name          }          supportedLongStay        }        facilities {          id        }        images {          hotelImages {            id            caption            providerId            urls {              key              value            }          }        }        reviews {          contentReview {            isDefault            providerId            demographics {              groups {                id                grades {                  id                  score                }              }            }            summaries {              recommendationScores {                recommendationScore              }              snippets {                countryId                countryCode                countryName                date                demographicId                demographicName                reviewer                reviewRating                snippet              }            }            cumulative {              reviewCount              score            }          }          cumulative {            reviewCount            score          }        }        familyFeatures {          hasChildrenFreePolicy          isFamilyRoom          hasMoreThanOneBedroom          isInterConnectingRoom          isInfantCottageAvailable          hasKidsPool          hasKidsClub        }        personalizedInformation {          childrenFreePolicy {            fromAge            toAge          }        }        localInformation {          landmarks {            transportation {              landmarkName              distanceInM            }            topLandmark {              landmarkName              distanceInM            }          }          hasAirportTransfer        }        highlight {          cityCenter {            isInsideCityCenter          }          favoriteFeatures {            features {              id              title              category            }          }          hasNearbyPublicTransportation        }      }      soldOut {        soldOutPrice {          averagePrice        }      }      pricing {        isAvailable        isReady        benefits        isEasyCancel        isInsiderDeal        suggestPriceType {          suggestPrice        }        roomBundle {          bundleId          bundleType          saveAmount {            perNight {              ...Fragf6bib2a79b4hcd7gi7db            }          }        }        pointmax {          channelId          point        }        priceChange {          changePercentage          searchDate        }        payment {          cancellation {            cancellationType          }          payLater {            isEligible          }          payAtHotel {            isEligible          }          noCreditCard {            isEligible          }          taxReceipt {            isEligible          }        }        pricingMessages {          location          ids        }        suppliersSummaries {          id          supplierHotelId        }        supplierInfo {          id          name          isAgodaBand        }        offers {          roomOffers {            room {              availableRooms              isPromoEligible              promotions {                typeId              }              supplierId              corSummary {                hasCor                corType                isOriginal                hasOwnCOR                isBlacklistedCor              }              pricing {                currency                price {                  perNight {                    exclusive {                      display                      originalPrice                    }                    inclusive {                      display                      originalPrice                    }                  }                  perBook {                    exclusive {                      display                      rebatePrice                      originalPrice                    }                    inclusive {                      display                      rebatePrice                      originalPrice                    }                  }                  perRoomPerNight {                    exclusive {                      display                      crossedOutPrice                      rebatePrice                      pseudoCouponPrice                      originalPrice                    }                    inclusive {                      display                      crossedOutPrice                      rebatePrice                      pseudoCouponPrice                      originalPrice                    }                  }                  totalDiscount                  priceAfterAppliedAgodaCash {                    perBook {                      ...Frag9931a2cdhaj820eij8ib                    }                    perRoomPerNight {                      ...Frag9931a2cdhaj820eij8ib                    }                  }                }                apsPeek {                  perRoomPerNight {                    ...Fragf6bib2a79b4hcd7gi7db                  }                }                promotionPricePeek {                  display {                    perBook {                      ...Fragf6bib2a79b4hcd7gi7db                    }                    perRoomPerNight {                      ...Fragf6bib2a79b4hcd7gi7db                    }                    perNight {                      ...Fragf6bib2a79b4hcd7gi7db                    }                  }                  discountType                  promotionCode                  promoAppliedOnFinalPrice                }                channelDiscountSummary {                  channelDiscountBreakdown {                    display                    discountPercent                    channelId                  }                }              }              payment {                cancellation {                  cancellationType                }              }              discount {                deals                channelDiscount              }              saveUpTo {                perRoomPerNight              }              benefits {                id              }              channel {                id              }              mseRoomSummaries {                supplierId                subSupplierId                pricingSummaries {                  currency                  channelDiscountSummary {                    channelDiscountBreakdown {                      channelId                      discountPercent                      display                    }                  }                  price {                    perRoomPerNight {                      exclusive {                        display                      }                      inclusive {                        display                      }                    }                  }                }              }              agodaCash {                showBadge                giftcardGuid                dayToEarn                expiryDay              }              corInfo {                corBreakdown {                  taxExPN {                    ...Fragj02248dc68d9a55d871d                  }                  taxInPN {                    ...Fragj02248dc68d9a55d871d                  }                  taxExPRPN {                    ...Fragj02248dc68d9a55d871d                  }                  taxInPRPN {                    ...Fragj02248dc68d9a55d871d                  }                }                corInfo {                  corType                }              }              loyaltyDisplay {                items              }              capacity {                extraBedsAvailable              }              pricingMessages {                formatted {                  location                  texts {                    index                    text                  }                }              }            }          }        }      }      enrichment {        topSellingPoint {          tspType          value        }        pricingBadges {          badges        }        uniqueSellingPoint {          rank          segment          uspType          uspPropertyType        }        bookingHistory {          bookingCount {            count            timeFrame          }        }        showReviewSnippet        isPopular      }    }    searchEnrichment {      suppliersInformation {        supplierId        supplierName        isAgodaBand      }    }    aggregation {      matrixGroupResults {        matrixGroup        matrixItemResults {          id          name          count          filterKey          filterRequestType          extraDataResults {            text            matrixExtraDataType          }        }      }    }  }}fragment Frag9931a2cdhaj820eij8ib on DisplayPrice {  exclusive  allInclusive}fragment Fragf6bib2a79b4hcd7gi7db on DFDisplayPrice {  exclusive  allInclusive}fragment Fragj02248dc68d9a55d871d on DFCorBreakdownItem {  price  id}"
    };
  }
}

module.exports = AgodaService;