const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    treatmentPack: String,
    ingredients: String,
    howToDo: String,
    userFeedback: [String],
});

const resultSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    prediction: {
        type: String,
        required: true
    },
    recommendations: {
        type: [recommendationSchema],
        required: true
    },
});

module.exports = mongoose.model('Result', resultSchema);
