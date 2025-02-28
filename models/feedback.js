const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    feedback: {
        type: String,
        required: true,
    },
    prediction: {
        type: String,
        required: true,
    },
    treatmentPack: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
