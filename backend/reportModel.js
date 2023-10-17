const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    startDate: Date,
    endDate: Date,
    month: String,
    year: Number,
    excludeDates: [Date],
    numDays: Number,
    leadCount: Number,
    expectedLeadCount: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);
