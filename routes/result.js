const express = require('express');
const router = express.Router();
const Result = require('../models/Result');


router.post('/', async (req, res) => {
    try {
        const { userEmail, prediction, recommendations } = req.body;
        console.log('Received:', req.body);

        if (!userEmail || !prediction || !Array.isArray(recommendations)) {
            return res.status(400).json({ success: false, message: 'Invalid data' });
        }

        const newResult = new Result({
            userEmail,
            prediction,
            recommendations,
        });

        await newResult.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error saving results:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:userEmail', async (req, res) => {
    try {
        const { userEmail } = req.params;
        const results = await Result.find({ userEmail });

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error('Error retrieving results:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


module.exports = router;
