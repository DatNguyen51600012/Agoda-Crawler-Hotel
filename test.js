const moment = require('moment');
const fetch = require('node-fetch');
const async = require('async');
const path = require('path');
const Queue = require('bull');
const mongoose = require('mongoose');

// const date = moment('2020-10-07');
// console.log(moment().toISOString());


// fetch("https://www.agoda.com/Search/Search/GetUnifiedSuggestResult/3/1/1/0/en-us/?searchText=Da%20Nang&origin=VN&isHotelLandSearch=true", {
//   "headers": {
//     "accept": "application/json, text/javascript, */*; q=0.01",
//     "accept-language": "en-US,en;q=0.9",
//     "content-type": "application/json; charset=utf-8",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//   },
  
//   "referrerPolicy": "origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors"
// }).then(res => res.json()).then(console.log);
process.on('SIGINT', () => {
  process.exit();
})

const con = mongoose.createConnection('mongodb://localhost:27017/api_payme_vn',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
const Location = con.model(
  'Location', 
  new mongoose.Schema({
    title: String
  }),
  'Location'
);

async function main() {
  const lo = await Location.find({}).limit(1);
  console.log(lo);
  // new Queue('AgodaGetCityData').add({
  //   id: 1,
  //   name: 'Quy Nhon'
  // });
}

main();