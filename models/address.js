const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  region: String,
  city: String,
  branchNumber: String,
  address: String,
  phone: String,
  workingHours: Object,
});

module.exports = mongoose.model("Address", addressSchema);
