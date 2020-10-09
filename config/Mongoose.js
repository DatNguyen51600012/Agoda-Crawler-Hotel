module.exports = {
  agoda: {
    uri: 'mongodb://localhost:27017/agoda5',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  },
  payme: {
    uri: 'mongodb://localhost:27017/api_payme_vn',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  },
};
