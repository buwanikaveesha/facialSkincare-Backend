import mongoose from 'mongoose';

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
},{timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
