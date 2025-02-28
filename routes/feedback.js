const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");

 
router.post("/", async (req, res) => {
    console.log("Request Body:", req.body); 

    const { feedback, prediction, treatmentPack } = req.body;

    if (!feedback || !prediction || !treatmentPack) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    try {
        const newFeedback = new Feedback({ feedback, prediction, treatmentPack });
        await newFeedback.save();

        res.status(201).json({ success: true, message: "Feedback saved successfully!" });
    } catch (error) {
        console.error("Error saving feedback:", error.message);  
        res.status(500).json({ success: false, message: "Failed to save feedback." });
    }
});

 
 
router.get("/:treatmentPack", async (req, res) => {
	
    const treatmentPack = decodeURIComponent(req.params.treatmentPack);  
    console.log("Treatment Pack:", treatmentPack);  

    try {
        const feedbacks = await Feedback.find({ treatmentPack });

 
        console.log("Feedbacks fetched:", JSON.stringify(feedbacks, null, 2));
 
        if (feedbacks.length === 0) {
            return res.status(200).json({ feedbacks: [] });
        }

        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;