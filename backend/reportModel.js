const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  startDate: Date,
  endDate: Date,
  id: Number,
  month: String,
  year: Number,
  excludeDates: [Date],
  numDays: Number,
  leadCount: Number,
  expectedLeadCount: Number,
});

module.exports = mongoose.model("Report", reportSchema);
