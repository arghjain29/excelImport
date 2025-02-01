const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  sheetName: String,
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  verified: { type: Boolean, required: true },
});

module.exports = mongoose.model("Data", DataSchema);
