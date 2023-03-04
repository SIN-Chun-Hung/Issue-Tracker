const mongoose = require('mongoose');
const dbconnection = mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

module.exports = dbconnection; 