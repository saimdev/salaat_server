const mongoose = require("mongoose");

const timingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    fajr: {
        type: String,
    },
    zuhr: {
        type: String,
    },
    asr: {
        type: String,
    },
    maghrib: {
        type: String,
    },
    isha: {
        type: String,
    },
    jumma:{
        type:String
    }
});

const Timing = mongoose.model("TIMING", timingSchema);
module.exports = Timing;
