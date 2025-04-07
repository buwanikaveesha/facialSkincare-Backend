import express from "express";
import { AddFeedback, GetUserFeedback } from "../controller/feedback-controller.js";

const router = express.Router();

router.get('/get-user-feedback/:treatmentPack', GetUserFeedback);
router.post('/add-feedback', AddFeedback);

export default router;